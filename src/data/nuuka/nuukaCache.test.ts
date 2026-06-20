import { describe, expect, it, vi } from 'vitest'
import {
  createCompletedCacheKey,
  createNuukaMemoryCache,
  FALLBACK_STRATEGY_VERSION,
} from './nuukaCache'

describe('Nuuka memory cache', () => {
  it('uses the complete approved cache key and excludes refresh mode', () => {
    const key = createCompletedCacheKey({
      provider: 'Nuuka',
      propertyCode: '091-002-0014-0005',
      utility: 'electricity',
      productPeriod: '24h',
      requestedGranularity: 'hourly',
      requestedStart: '2026-05-20',
      requestedEnd: '2026-06-19',
      fallbackStrategyVersion: FALLBACK_STRATEGY_VERSION,
    })

    expect(key).toBe(
      'Nuuka|091-002-0014-0005|electricity|24h|hourly|2026-05-20|2026-06-19|nuuka-v1-same-granularity-anchor',
    )
  })

  it('deduplicates in-flight requests and expires cached entries', async () => {
    vi.useFakeTimers()
    const cache = createNuukaMemoryCache<string>({ ttlMs: 1000, emptyTtlMs: 100 })
    const key = 'key'
    const loader = vi.fn(async () => 'result')

    const [first, second] = await Promise.all([
      cache.getOrLoad(key, 'default', loader),
      cache.getOrLoad(key, 'default', loader),
    ])
    expect(first).toBe('result')
    expect(second).toBe('result')
    expect(loader).toHaveBeenCalledTimes(1)

    expect(await cache.getOrLoad(key, 'default', loader)).toBe('result')
    expect(loader).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(1001)
    expect(await cache.getOrLoad(key, 'default', loader)).toBe('result')
    expect(loader).toHaveBeenCalledTimes(2)
    vi.useRealTimers()
  })

  it('force refresh bypasses completed cache', async () => {
    const cache = createNuukaMemoryCache<string>({ ttlMs: 1000, emptyTtlMs: 100 })
    const loader = vi.fn(async () => `result-${loader.mock.calls.length}`)

    expect(await cache.getOrLoad('key', 'default', loader)).toBe('result-1')
    expect(await cache.getOrLoad('key', 'force', loader)).toBe('result-2')
  })
})
