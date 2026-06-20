import type { UtilityDataError } from '../utilities/utilitySeries'
import { oodiConfig } from '../../config/oodi'
import { utilityDefinitions } from '../utilities/utilityDefinitions'
import { NUUKA_BASE_URL } from './nuukaEndpoints'

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

function isConfirmedNuukaNoData404(endpoint: string, body: string) {
  let url: URL
  try {
    url = new URL(endpoint)
  } catch {
    return false
  }

  const baseUrl = new URL(NUUKA_BASE_URL)
  const supportedReportingGroups: ReadonlySet<string> = new Set(
    utilityDefinitions.map((utility) => utility.reportingGroup),
  )

  const isConfirmedEnergyRequest =
    url.origin === baseUrl.origin &&
    /^\/api\/v1\.0\/EnergyData\/(Hourly|Daily|Monthly)\/ListByProperty$/.test(url.pathname) &&
    url.searchParams.get('Record') === 'LocationName' &&
    url.searchParams.get('SearchString') === oodiConfig.nuuka.locationName &&
    supportedReportingGroups.has(url.searchParams.get('ReportingGroup') ?? '') &&
    /^\d{4}-\d{2}-\d{2}$/.test(url.searchParams.get('StartTime') ?? '') &&
    /^\d{4}-\d{2}-\d{2}$/.test(url.searchParams.get('EndTime') ?? '')

  if (!isConfirmedEnergyRequest) {
    return false
  }

  if (body.trim() === '') {
    return true
  }

  try {
    const payload = JSON.parse(body) as { errorCode?: unknown; errorNote?: unknown }
    return (
      payload.errorCode === 'MissingSettingsException' &&
      typeof payload.errorNote === 'string' &&
      payload.errorNote.toLowerCase().includes('no data found')
    )
  } catch {
    return false
  }
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

    if (response.status === 404 && isConfirmedNuukaNoData404(String(endpoint), text)) {
      return {
        ok: true,
        data: [],
      }
    }

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
