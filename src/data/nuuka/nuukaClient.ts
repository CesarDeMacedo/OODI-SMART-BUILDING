import type { UtilityDataError } from '../utilities/utilitySeries'

export type NuukaJsonResult =
  | { ok: true; data: unknown }
  | { ok: false; error: UtilityDataError }

export interface FetchNuukaJsonOptions {
  fetcher?: typeof fetch
  signal?: AbortSignal
  timeoutMs?: number
}

function isRetryableStatus(status: number) {
  return status === 429 || status === 502 || status === 503 || status === 504
}

export async function fetchNuukaJson(
  endpoint: string,
  options: FetchNuukaJsonOptions = {},
): Promise<NuukaJsonResult> {
  const fetcher = options.fetcher ?? fetch
  const timeoutMs = options.timeoutMs ?? 15_000
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
    const response = await fetcher(endpoint, { signal: controller.signal })
    const text = await response.text()

    if (!response.ok) {
      return {
        ok: false,
        error: {
          code: 'HTTP',
          message: `Nuuka request failed with HTTP ${response.status}.`,
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
          message: 'Nuuka returned invalid JSON.',
          retryable: true,
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
            message: `Nuuka request timed out after ${timeoutMs} ms.`,
            retryable: true,
            cause,
          },
        }
      }

      return {
        ok: false,
        error: {
          code: 'ABORTED',
          message: 'Nuuka request was aborted.',
          retryable: false,
          cause,
        },
      }
    }

    return {
      ok: false,
      error: {
        code: 'NETWORK',
        message: 'Nuuka network request failed.',
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
