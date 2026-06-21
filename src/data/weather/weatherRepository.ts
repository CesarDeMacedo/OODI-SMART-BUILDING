import { buildOpenMeteoForecastUrl } from './weatherEndpoints'
import { fetchOpenMeteoJson } from './weatherClient'
import { normalizeOpenMeteoWeather } from './normalizeWeather'
import { createDefaultWeatherCacheKey, createWeatherMemoryCache } from './weatherCache'
import { WEATHER_CACHE_TTL_MS, WEATHER_EMPTY_CACHE_TTL_MS } from './weatherDefinitions'
import { validateOpenMeteoPayload } from './weatherValidation'
import type {
  WeatherDataError,
  WeatherPackage,
  WeatherRepository,
  WeatherRequest,
  WeatherResult,
} from './weatherTypes'

export type WeatherFetchPayload = (request: {
  endpoint: string
  signal?: AbortSignal
}) => Promise<unknown>

export interface CreateWeatherRepositoryOptions {
  fetchPayload?: WeatherFetchPayload
  retrievedAt?: () => string
}

function isWeatherDataError(error: unknown): error is WeatherDataError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    'retryable' in error
  )
}

function toWeatherDataError(error: unknown): WeatherDataError {
  if (isWeatherDataError(error)) {
    return error
  }

  return {
    code: 'UNKNOWN',
    message: 'Unexpected weather data error.',
    retryable: false,
    cause: error,
  }
}

function abortedResult(previousWeather?: WeatherPackage): WeatherResult {
  return {
    status: 'error',
    error: {
      code: 'ABORTED',
      message: 'Weather data request was aborted by the caller.',
      retryable: false,
    },
    previousWeather,
  }
}

function weatherFromMemoryCache(weather: WeatherPackage): WeatherPackage {
  return {
    ...weather,
    current: { ...weather.current, condition: { ...weather.current.condition } },
    hourly: weather.hourly.map((point) => ({
      ...point,
      condition: { ...point.condition },
    })),
    daily: weather.daily.map((point) => ({
      ...point,
      condition: { ...point.condition },
    })),
    provider: {
      ...weather.provider,
      origin: 'memory-cache',
    },
    qualityNotices: weather.qualityNotices.map((notice) => ({ ...notice })),
  }
}

function markResultFromMemoryCache(result: WeatherResult): WeatherResult {
  if (result.status === 'success') {
    return {
      ...result,
      weather: weatherFromMemoryCache(result.weather),
    }
  }

  if (result.status === 'partial') {
    return {
      ...result,
      weather: weatherFromMemoryCache(result.weather),
    }
  }

  return result
}

function withCallerAbort(
  promise: Promise<WeatherResult>,
  signal: AbortSignal | undefined,
  getPreviousWeather: () => WeatherPackage | undefined,
): Promise<WeatherResult> {
  if (!signal) {
    return promise
  }

  if (signal.aborted) {
    return Promise.resolve(abortedResult(getPreviousWeather()))
  }

  return new Promise((resolve) => {
    const onAbort = () => resolve(abortedResult(getPreviousWeather()))
    signal.addEventListener('abort', onAbort, { once: true })

    promise.then(
      (result) => {
        signal.removeEventListener('abort', onAbort)
        resolve(result)
      },
      (error) => {
        signal.removeEventListener('abort', onAbort)
        resolve({
          status: 'error',
          error: toWeatherDataError(error),
          previousWeather: getPreviousWeather(),
        })
      },
    )
  })
}

export function createWeatherRepository(
  options: CreateWeatherRepositoryOptions = {},
): WeatherRepository {
  const cache = createWeatherMemoryCache<WeatherResult>({
    ttlMs: WEATHER_CACHE_TTL_MS,
    emptyTtlMs: WEATHER_EMPTY_CACHE_TTL_MS,
    onCacheHit: markResultFromMemoryCache,
  })
  const retrievedAt = options.retrievedAt ?? (() => new Date().toISOString())
  let previousWeather: WeatherPackage | undefined

  async function defaultFetchPayload({ endpoint, signal }: Parameters<WeatherFetchPayload>[0]) {
    const result = await fetchOpenMeteoJson(endpoint, { signal })
    if (!result.ok) {
      throw result.error
    }
    return result.data
  }

  async function load(request: WeatherRequest): Promise<WeatherResult> {
    const endpoint = buildOpenMeteoForecastUrl()
    const payload = await (options.fetchPayload ?? defaultFetchPayload)({
      endpoint,
      signal: request.signal,
    })
    const validation = validateOpenMeteoPayload(payload)

    if (!validation.ok) {
      return {
        status: 'error',
        error: validation.error,
        previousWeather,
      }
    }

    const result = normalizeOpenMeteoWeather({
      validated: validation.data,
      validationNotices: validation.notices,
      endpoint,
      retrievedAt: retrievedAt(),
      origin: 'network',
    })

    previousWeather = result.weather
    return result
  }

  return {
    async getWeather(request: WeatherRequest = {}) {
      if (request.signal?.aborted) {
        return abortedResult(previousWeather)
      }

      const promise = cache
        .getOrLoad(
          createDefaultWeatherCacheKey(),
          request.refresh ?? 'default',
          () => load(request),
        )
        .catch((error: unknown): WeatherResult => ({
          status: 'error',
          error: toWeatherDataError(error),
          previousWeather,
        }))

      return withCallerAbort(promise, request.signal, () => previousWeather)
    },
    invalidate() {
      cache.invalidate()
    },
  }
}

export const weatherRepository = createWeatherRepository()
