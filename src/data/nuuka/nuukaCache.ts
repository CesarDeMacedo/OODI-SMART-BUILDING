import type { Granularity, ProductPeriod, UtilityId } from '../utilities/utilitySeries'

export const FALLBACK_STRATEGY_VERSION = 'nuuka-v1-same-granularity-anchor'

export interface CompletedCacheKeyParts {
  provider: 'Nuuka'
  propertyCode: string
  utility: UtilityId
  productPeriod: ProductPeriod
  requestedGranularity: Granularity
  requestedStart: string
  requestedEnd: string
  fallbackStrategyVersion: string
}

export function createCompletedCacheKey(parts: CompletedCacheKeyParts) {
  return [
    parts.provider,
    parts.propertyCode,
    parts.utility,
    parts.productPeriod,
    parts.requestedGranularity,
    parts.requestedStart,
    parts.requestedEnd,
    parts.fallbackStrategyVersion,
  ].join('|')
}

export interface NuukaMemoryCacheOptions {
  ttlMs: number
  emptyTtlMs: number
}

type CacheEntry<T> = {
  value: T
  expiresAt: number
}

export function createNuukaMemoryCache<T>(options: NuukaMemoryCacheOptions) {
  const completed = new Map<string, CacheEntry<T>>()
  const inFlight = new Map<string, Promise<T>>()

  function getCached(key: string, now: number) {
    const entry = completed.get(key)
    if (!entry || entry.expiresAt <= now) {
      if (entry) {
        completed.delete(key)
      }
      return null
    }

    return entry.value
  }

  return {
    async getOrLoad(
      key: string,
      refresh: 'default' | 'force',
      loader: () => Promise<T>,
      isEmpty = false,
    ) {
      const now = Date.now()
      if (refresh !== 'force') {
        const cached = getCached(key, now)
        if (cached !== null) {
          return cached
        }
      }

      const inFlightKey = `${refresh}:${key}`
      const existing = inFlight.get(inFlightKey)
      if (existing) {
        return existing
      }

      const promise = loader().then((value) => {
        completed.set(key, {
          value,
          expiresAt: Date.now() + (isEmpty ? options.emptyTtlMs : options.ttlMs),
        })
        return value
      })

      inFlight.set(inFlightKey, promise)
      try {
        return await promise
      } finally {
        inFlight.delete(inFlightKey)
      }
    },
    invalidate(predicate?: (key: string) => boolean) {
      for (const key of completed.keys()) {
        if (!predicate || predicate(key)) {
          completed.delete(key)
        }
      }
    },
  }
}
