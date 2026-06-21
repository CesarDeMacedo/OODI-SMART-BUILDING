import { oodiConfig } from '../../config/oodi'
import {
  FORECAST_DAYS,
  WEATHER_STRATEGY_VERSION,
  currentWeatherVariables,
  dailyWeatherVariables,
  hourlyWeatherVariables,
} from './weatherDefinitions'

export interface WeatherCacheKeyParts {
  provider: 'Open-Meteo'
  latitude: number
  longitude: number
  timezone: string
  forecastDays: number
  strategyVersion: string
  currentVariables: readonly string[]
  hourlyVariables: readonly string[]
  dailyVariables: readonly string[]
}

export function createWeatherCacheKey(parts: WeatherCacheKeyParts) {
  return [
    parts.provider,
    parts.latitude,
    parts.longitude,
    parts.timezone,
    parts.forecastDays,
    parts.strategyVersion,
    parts.currentVariables.join(','),
    parts.hourlyVariables.join(','),
    parts.dailyVariables.join(','),
  ].join('|')
}

export function createDefaultWeatherCacheKey() {
  return createWeatherCacheKey({
    provider: 'Open-Meteo',
    latitude: oodiConfig.weather.latitude,
    longitude: oodiConfig.weather.longitude,
    timezone: oodiConfig.weather.timezone,
    forecastDays: FORECAST_DAYS,
    strategyVersion: WEATHER_STRATEGY_VERSION,
    currentVariables: currentWeatherVariables,
    hourlyVariables: hourlyWeatherVariables,
    dailyVariables: dailyWeatherVariables,
  })
}

export interface WeatherMemoryCacheOptions<T> {
  ttlMs: number
  emptyTtlMs: number
  onCacheHit?: (value: T) => T
}

type CacheEntry<T> = {
  value: T
  expiresAt: number
}

export function createWeatherMemoryCache<T>(options: WeatherMemoryCacheOptions<T>) {
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
          return options.onCacheHit ? options.onCacheHit(cached) : cached
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
    invalidate() {
      completed.clear()
    },
  }
}
