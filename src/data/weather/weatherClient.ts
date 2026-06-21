import type { WeatherDataError } from './weatherTypes'

export type OpenMeteoJsonResult =
  | { ok: true; data: unknown }
  | { ok: false; error: WeatherDataError }

export interface FetchOpenMeteoJsonOptions {
  fetcher?: typeof fetch
  signal?: AbortSignal
  timeoutMs?: number
}

function isRetryableStatus(status: number) {
  return status === 429 || status === 502 || status === 503 || status === 504
}

function parseProviderError(text: string) {
  try {
    const payload = JSON.parse(text) as { reason?: unknown }
    return typeof payload.reason === 'string' ? payload.reason : null
  } catch {
    return null
  }
}

async function fetchOnce(
  endpoint: string,
  fetcher: typeof fetch,
  signal: AbortSignal,
): Promise<Response> {
  return fetcher(endpoint, { signal })
}

export async function fetchOpenMeteoJson(
  endpoint: string,
  options: FetchOpenMeteoJsonOptions = {},
): Promise<OpenMeteoJsonResult> {
  const fetcher = options.fetcher ?? fetch
  const timeoutMs = options.timeoutMs ?? 10_000
  const controller = new AbortController()
  let timedOut = false
  let timeoutHandle: ReturnType<typeof setTimeout> | undefined

  const abortFromCaller = () => controller.abort(options.signal?.reason)
  if (options.signal?.aborted) {
    abortFromCaller()
  } else {
    options.signal?.addEventListener('abort', abortFromCaller, { once: true })
  }

  if (Number.isFinite(timeoutMs) && timeoutMs > 0) {
    timeoutHandle = setTimeout(() => {
      timedOut = true
      controller.abort()
    }, timeoutMs)
  }

  try {
    let response = await fetchOnce(endpoint, fetcher, controller.signal)
    let text = await response.text()

    if (!response.ok && isRetryableStatus(response.status)) {
      response = await fetchOnce(endpoint, fetcher, controller.signal)
      text = await response.text()
    }

    if (!response.ok) {
      const providerReason = parseProviderError(text)
      return {
        ok: false,
        error: {
          code: 'HTTP',
          message: providerReason
            ? `Open-Meteo request failed with HTTP ${response.status}: ${providerReason}`
            : `Open-Meteo request failed with HTTP ${response.status}.`,
          retryable: isRetryableStatus(response.status),
          statusCode: response.status,
        },
      }
    }

    try {
      return {
        ok: true,
        data: text.trim() ? JSON.parse(text) : null,
      }
    } catch (cause) {
      return {
        ok: false,
        error: {
          code: 'INVALID_JSON',
          message: 'Open-Meteo returned invalid JSON.',
          retryable: false,
          cause,
        },
      }
    }
  } catch (cause) {
    if (cause instanceof DOMException && cause.name === 'AbortError') {
      if (timedOut) {
        return {
          ok: false,
          error: {
            code: 'TIMEOUT',
            message: `Open-Meteo request timed out after ${timeoutMs} ms.`,
            retryable: true,
            cause,
          },
        }
      }

      return {
        ok: false,
        error: {
          code: 'ABORTED',
          message: 'Open-Meteo request was aborted.',
          retryable: false,
          cause,
        },
      }
    }

    return {
      ok: false,
      error: {
        code: 'NETWORK',
        message: 'Open-Meteo network request failed.',
        retryable: true,
        cause,
      },
    }
  } finally {
    if (timeoutHandle) {
      clearTimeout(timeoutHandle)
    }
    options.signal?.removeEventListener('abort', abortFromCaller)
  }
}
