import { oodiConfig } from '../../config/oodi'
import { getRequestedWindowForPeriod } from '../time/helsinkiCivilDate'
import { FALLBACK_STRATEGY_VERSION, createCompletedCacheKey, createNuukaMemoryCache } from '../nuuka/nuukaCache'
import { resolveNuukaSeries } from '../nuuka/nuukaFallback'
import { canUseSnapshotForError, loadNuukaSnapshotSeries } from '../nuuka/nuukaSnapshots'
import type {
  UtilityDataError,
  UtilityRepository,
  UtilitySeries,
  UtilitySeriesRequest,
  UtilitySeriesResult,
} from './utilitySeries'
import { getPeriodDefinition } from './utilityPeriods'
import { fetchNuukaJson } from '../nuuka/nuukaClient'

type FetchPayloadRequest = {
  utility: UtilitySeriesRequest['utility']
  granularity: ReturnType<typeof getPeriodDefinition>['granularity']
  start: string
  end: string
  endpoint: string
}

function isUtilityDataError(error: unknown): error is UtilityDataError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    'retryable' in error
  )
}

function toUtilityDataError(error: unknown): UtilityDataError {
  if (isUtilityDataError(error)) {
    return error
  }

  return {
    code: 'UNKNOWN',
    message: 'Unexpected utility data error.',
    retryable: false,
    cause: error,
  }
}

function abortedResult(): UtilitySeriesResult {
  return {
    status: 'error',
    error: {
      code: 'ABORTED',
      message: 'Utility data request was aborted by the caller.',
      retryable: false,
    },
  }
}

function seriesFromMemoryCache(series: UtilitySeries): UtilitySeries {
  return {
    ...series,
    points: [...series.points],
    latestReading: series.latestReading ? { ...series.latestReading } : null,
    period: {
      ...series.period,
      requestedWindow: { ...series.period.requestedWindow },
      effectiveWindow: series.period.effectiveWindow
        ? { ...series.period.effectiveWindow }
        : null,
    },
    provenance: {
      ...series.provenance,
      origin: 'memory-cache',
    },
    qualityNotices: series.qualityNotices.map((notice) => ({ ...notice })),
  }
}

function markResultFromMemoryCache(result: UtilitySeriesResult): UtilitySeriesResult {
  if (result.status === 'success') {
    return {
      ...result,
      series: seriesFromMemoryCache(result.series),
    }
  }

  if (result.status === 'empty') {
    return {
      ...result,
      series: seriesFromMemoryCache(result.series),
    }
  }

  return result
}

function withCallerAbort(
  promise: Promise<UtilitySeriesResult>,
  signal?: AbortSignal,
): Promise<UtilitySeriesResult> {
  if (!signal) {
    return promise
  }

  if (signal.aborted) {
    return Promise.resolve(abortedResult())
  }

  return new Promise((resolve) => {
    const onAbort = () => resolve(abortedResult())
    signal.addEventListener('abort', onAbort, { once: true })

    promise.then(
      (result) => {
        signal.removeEventListener('abort', onAbort)
        resolve(result)
      },
      (error) => {
        signal.removeEventListener('abort', onAbort)
        resolve({ status: 'error', error: toUtilityDataError(error) })
      },
    )
  })
}

export interface CreateUtilityRepositoryOptions {
  fetchPayload?: (request: FetchPayloadRequest) => Promise<unknown>
  snapshotFetcher?: typeof fetch
  now?: () => Date
  retrievedAt?: () => string
}

export function createUtilityRepository(
  options: CreateUtilityRepositoryOptions = {},
): UtilityRepository {
  const cache = createNuukaMemoryCache<UtilitySeriesResult>({
    ttlMs: 10 * 60 * 1000,
    emptyTtlMs: 2 * 60 * 1000,
    onCacheHit: markResultFromMemoryCache,
  })
  const now = options.now ?? (() => new Date())
  const retrievedAt = options.retrievedAt ?? (() => new Date().toISOString())

  async function defaultFetchPayload(request: FetchPayloadRequest) {
    const result = await fetchNuukaJson(request.endpoint)

    if (!result.ok) {
      throw result.error
    }

    return result.data
  }

  return {
    async getSeries(request: UtilitySeriesRequest) {
      if (request.signal?.aborted) {
        return abortedResult()
      }

      const periodDefinition = getPeriodDefinition(request.period)
      const requestedWindow = getRequestedWindowForPeriod(request.period, request.end ?? now())
      const key = createCompletedCacheKey({
        provider: 'Nuuka',
        propertyCode: oodiConfig.nuuka.propertyCode,
        utility: request.utility,
        productPeriod: request.period,
        requestedGranularity: periodDefinition.granularity,
        requestedStart: requestedWindow.start,
        requestedEnd: requestedWindow.end,
        fallbackStrategyVersion: FALLBACK_STRATEGY_VERSION,
      })

      const loadPromise = cache.getOrLoad(
        key,
        request.refresh ?? 'default',
        () =>
          resolveNuukaSeries({
            utility: request.utility,
            period: request.period,
            requestedWindow,
            fetchPayload: options.fetchPayload ?? defaultFetchPayload,
            retrievedAt: retrievedAt(),
          }),
      )
      const recover = async (error: unknown): Promise<UtilitySeriesResult> => {
        const typedError = toUtilityDataError(error)
        if (canUseSnapshotForError(typedError)) {
          try {
            const snapshot = await loadNuukaSnapshotSeries({
              utility: request.utility,
              period: request.period,
              granularity: periodDefinition.granularity,
              requestedWindow,
              retrievedAt: retrievedAt(),
              fallbackReason:
                typedError.code === 'NETWORK' || typedError.code === 'TIMEOUT'
                  ? 'network-unavailable-snapshot-used'
                  : 'api-error-snapshot-used',
              fetcher: options.snapshotFetcher,
            })

            if (snapshot) {
              return snapshot
            }
          } catch {
            // Snapshot fallback is best-effort; preserve the original typed error.
          }
        }

        return { status: 'error', error: typedError }
      }

      return withCallerAbort(loadPromise.catch(recover), request.signal)
    },
    invalidate(request) {
      cache.invalidate((key) => {
        if (!request?.utility && !request?.period) {
          return true
        }

        const parts = key.split('|')
        const utility = parts[2]
        const period = parts[3]
        return (
          (!request.utility || utility === request.utility) &&
          (!request.period || period === request.period)
        )
      })
    },
  }
}

export const utilityRepository = createUtilityRepository()
