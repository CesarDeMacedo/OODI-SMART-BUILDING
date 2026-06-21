import { describe, expect, it, vi } from 'vitest'
import {
  createDefaultWeatherCacheKey,
  createWeatherCacheKey,
  createWeatherMemoryCache,
} from './weatherCache'
import { WEATHER_STRATEGY_VERSION } from './weatherDefinitions'

describe('weather memory cache', () => {
  it('uses provider, coordinates, timezone, variables and strategy in the completed key', () => {
    const key = createWeatherCacheKey({
      provider: 'Open-Meteo',
      latitude: 60.1738,
      longitude: 24.9381,
      timezone: 'Europe/Helsinki',
      forecastDays: 3,
      strategyVersion: WEATHER_STRATEGY_VERSION,
      currentVariables: ['temperature_2m'],
      hourlyVariables: ['temperature_2m'],
      dailyVariables: ['weather_code'],
    })

    expect(key).toBe(
      'Open-Meteo|60.1738|24.9381|Europe/Helsinki|3|open-meteo-v1-current-24h-3d|temperature_2m|temperature_2m|weather_code',
    )
  })

  it('derives the default key from the shared Oodi weather configuration', () => {
    expect(createDefaultWeatherCacheKey()).toContain('Open-Meteo|60.1738|24.9381|Europe/Helsinki|3')
  })

  it('deduplicates in-flight requests and expires cached entries', async () => {
    vi.useFakeTimers()
    const cache = createWeatherMemoryCache<string>({ ttlMs: 1000, emptyTtlMs: 100 })
    const loader = vi.fn(async () => 'weather')

    const [first, second] = await Promise.all([
      cache.getOrLoad('key', 'default', loader),
      cache.getOrLoad('key', 'default', loader),
    ])

    expect(first).toBe('weather')
    expect(second).toBe('weather')
    expect(loader).toHaveBeenCalledTimes(1)

    expect(await cache.getOrLoad('key', 'default', loader)).toBe('weather')
    expect(loader).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(1001)
    expect(await cache.getOrLoad('key', 'default', loader)).toBe('weather')
    expect(loader).toHaveBeenCalledTimes(2)
    vi.useRealTimers()
  })

  it('force refresh bypasses completed cache', async () => {
    const cache = createWeatherMemoryCache<string>({ ttlMs: 1000, emptyTtlMs: 100 })
    const loader = vi.fn(async () => `weather-${loader.mock.calls.length}`)

    expect(await cache.getOrLoad('key', 'default', loader)).toBe('weather-1')
    expect(await cache.getOrLoad('key', 'force', loader)).toBe('weather-2')
  })
})
