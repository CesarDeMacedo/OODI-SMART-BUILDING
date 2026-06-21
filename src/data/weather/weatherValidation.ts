import type { WeatherDataError, WeatherQualityNotice } from './weatherTypes'

type CurrentBlock = {
  time: string
  interval: number
  temperature_2m: number
  apparent_temperature: number
  relative_humidity_2m: number
  precipitation: number
  weather_code: number
  cloud_cover: number
  wind_speed_10m: number
  wind_direction_10m: number
  wind_gusts_10m: number
  is_day: number
}

type HourlyBlock = {
  time: string[]
  temperature_2m: number[]
  apparent_temperature: number[]
  relative_humidity_2m: number[]
  precipitation_probability: Array<number | null>
  precipitation: number[]
  weather_code: number[]
  cloud_cover: number[]
  wind_speed_10m: number[]
  wind_gusts_10m: number[]
  safeLength: number
}

type DailyBlock = {
  time: string[]
  weather_code: number[]
  temperature_2m_max: number[]
  temperature_2m_min: number[]
  apparent_temperature_max: number[]
  apparent_temperature_min: number[]
  precipitation_sum: number[]
  precipitation_probability_max: Array<number | null>
  wind_speed_10m_max: number[]
  wind_gusts_10m_max: number[]
  sunrise: string[]
  sunset: string[]
  safeLength: number
}

export type ValidatedOpenMeteoPayload = {
  latitude: number
  longitude: number
  elevation: number | null
  generationtime_ms: number | null
  utc_offset_seconds: number
  timezone: string
  timezone_abbreviation: string | null
  current: CurrentBlock
  hourly: HourlyBlock
  daily: DailyBlock
}

export type OpenMeteoValidationResult =
  | { ok: true; data: ValidatedOpenMeteoPayload; notices: WeatherQualityNotice[] }
  | { ok: false; error: WeatherDataError }

const DATE_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/
const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/

const expectedCurrentUnits = {
  time: 'iso8601',
  interval: 'seconds',
  temperature_2m: '°C',
  apparent_temperature: '°C',
  relative_humidity_2m: '%',
  precipitation: 'mm',
  weather_code: 'wmo code',
  cloud_cover: '%',
  wind_speed_10m: 'km/h',
  wind_direction_10m: '°',
  wind_gusts_10m: 'km/h',
  is_day: '',
} as const

const expectedHourlyUnits = {
  time: 'iso8601',
  temperature_2m: '°C',
  apparent_temperature: '°C',
  relative_humidity_2m: '%',
  precipitation_probability: '%',
  precipitation: 'mm',
  weather_code: 'wmo code',
  cloud_cover: '%',
  wind_speed_10m: 'km/h',
  wind_gusts_10m: 'km/h',
} as const

const expectedDailyUnits = {
  time: 'iso8601',
  weather_code: 'wmo code',
  temperature_2m_max: '°C',
  temperature_2m_min: '°C',
  apparent_temperature_max: '°C',
  apparent_temperature_min: '°C',
  precipitation_sum: 'mm',
  precipitation_probability_max: '%',
  wind_speed_10m_max: 'km/h',
  wind_gusts_10m_max: 'km/h',
  sunrise: 'iso8601',
  sunset: 'iso8601',
} as const

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function isNumberOrNull(value: unknown): value is number | null {
  return value === null || isFiniteNumber(value)
}

function typedError(code: WeatherDataError['code'], message: string): WeatherDataError {
  return { code, message, retryable: false }
}

function assertUnits(
  unitBlock: unknown,
  expected: Record<string, string>,
): WeatherDataError | null {
  if (!isRecord(unitBlock)) {
    return typedError('UNEXPECTED_UNIT', 'Open-Meteo unit metadata is missing.')
  }

  for (const [field, unit] of Object.entries(expected)) {
    if (unitBlock[field] !== unit) {
      return typedError(
        'UNEXPECTED_UNIT',
        `Unexpected Open-Meteo unit for ${field}: ${String(unitBlock[field] ?? 'missing')}.`,
      )
    }
  }

  return null
}

function numberArray(value: unknown): number[] | null {
  return Array.isArray(value) && value.every(isFiniteNumber) ? value : null
}

function nullableNumberArray(value: unknown): Array<number | null> | null {
  return Array.isArray(value) && value.every(isNumberOrNull) ? value : null
}

function stringArray(value: unknown, pattern: RegExp): string[] | null {
  return Array.isArray(value) &&
    value.every((candidate) => typeof candidate === 'string' && pattern.test(candidate))
    ? value
    : null
}

function minLength(lengths: number[]) {
  return Math.min(...lengths)
}

function validateCurrent(value: unknown): CurrentBlock | null {
  if (!isRecord(value)) return null

  if (
    typeof value.time !== 'string' ||
    !DATE_TIME.test(value.time) ||
    !isFiniteNumber(value.interval) ||
    !isFiniteNumber(value.temperature_2m) ||
    !isFiniteNumber(value.apparent_temperature) ||
    !isFiniteNumber(value.relative_humidity_2m) ||
    !isFiniteNumber(value.precipitation) ||
    !isFiniteNumber(value.weather_code) ||
    !isFiniteNumber(value.cloud_cover) ||
    !isFiniteNumber(value.wind_speed_10m) ||
    !isFiniteNumber(value.wind_direction_10m) ||
    !isFiniteNumber(value.wind_gusts_10m) ||
    !isFiniteNumber(value.is_day)
  ) {
    return null
  }

  return value as CurrentBlock
}

function validateHourly(value: unknown, notices: WeatherQualityNotice[]): HourlyBlock | null {
  if (!isRecord(value)) return null

  const time = stringArray(value.time, DATE_TIME)
  const temperature = numberArray(value.temperature_2m)
  const apparent = numberArray(value.apparent_temperature)
  const humidity = numberArray(value.relative_humidity_2m)
  const probability = nullableNumberArray(value.precipitation_probability)
  const precipitation = numberArray(value.precipitation)
  const weatherCode = numberArray(value.weather_code)
  const cloud = numberArray(value.cloud_cover)
  const wind = numberArray(value.wind_speed_10m)
  const gust = numberArray(value.wind_gusts_10m)

  if (
    !time ||
    !temperature ||
    !apparent ||
    !humidity ||
    !probability ||
    !precipitation ||
    !weatherCode ||
    !cloud ||
    !wind ||
    !gust
  ) {
    return null
  }

  const lengths = [
    time.length,
    temperature.length,
    apparent.length,
    humidity.length,
    probability.length,
    precipitation.length,
    weatherCode.length,
    cloud.length,
    wind.length,
    gust.length,
  ]
  const safeLength = minLength(lengths)
  if (!lengths.every((length) => length === time.length)) {
    notices.push({
      code: 'HOURLY_FORECAST_PARTIAL',
      message: 'Hourly forecast arrays were misaligned; only index-aligned points are usable.',
      count: safeLength,
    })
  }

  return {
    time,
    temperature_2m: temperature,
    apparent_temperature: apparent,
    relative_humidity_2m: humidity,
    precipitation_probability: probability,
    precipitation,
    weather_code: weatherCode,
    cloud_cover: cloud,
    wind_speed_10m: wind,
    wind_gusts_10m: gust,
    safeLength,
  }
}

function validateDaily(value: unknown, notices: WeatherQualityNotice[]): DailyBlock | null {
  if (!isRecord(value)) return null

  const time = stringArray(value.time, DATE_ONLY)
  const weatherCode = numberArray(value.weather_code)
  const max = numberArray(value.temperature_2m_max)
  const min = numberArray(value.temperature_2m_min)
  const apparentMax = numberArray(value.apparent_temperature_max)
  const apparentMin = numberArray(value.apparent_temperature_min)
  const precipitation = numberArray(value.precipitation_sum)
  const probability = nullableNumberArray(value.precipitation_probability_max)
  const wind = numberArray(value.wind_speed_10m_max)
  const gust = numberArray(value.wind_gusts_10m_max)
  const sunrise = stringArray(value.sunrise, DATE_TIME)
  const sunset = stringArray(value.sunset, DATE_TIME)

  if (
    !time ||
    !weatherCode ||
    !max ||
    !min ||
    !apparentMax ||
    !apparentMin ||
    !precipitation ||
    !probability ||
    !wind ||
    !gust ||
    !sunrise ||
    !sunset
  ) {
    return null
  }

  const lengths = [
    time.length,
    weatherCode.length,
    max.length,
    min.length,
    apparentMax.length,
    apparentMin.length,
    precipitation.length,
    probability.length,
    wind.length,
    gust.length,
    sunrise.length,
    sunset.length,
  ]
  const safeLength = minLength(lengths)
  if (!lengths.every((length) => length === time.length)) {
    notices.push({
      code: 'DAILY_FORECAST_PARTIAL',
      message: 'Daily forecast arrays were misaligned; only index-aligned points are usable.',
      count: safeLength,
    })
  }

  return {
    time,
    weather_code: weatherCode,
    temperature_2m_max: max,
    temperature_2m_min: min,
    apparent_temperature_max: apparentMax,
    apparent_temperature_min: apparentMin,
    precipitation_sum: precipitation,
    precipitation_probability_max: probability,
    wind_speed_10m_max: wind,
    wind_gusts_10m_max: gust,
    sunrise,
    sunset,
    safeLength,
  }
}

export function validateOpenMeteoPayload(payload: unknown): OpenMeteoValidationResult {
  if (!isRecord(payload)) {
    return {
      ok: false,
      error: typedError('INVALID_SCHEMA', 'Open-Meteo payload was not an object.'),
    }
  }

  const notices: WeatherQualityNotice[] = []
  const current = validateCurrent(payload.current)
  if (!current) {
    return {
      ok: false,
      error: typedError('MISSING_CURRENT', 'Open-Meteo current weather block is missing required fields.'),
    }
  }

  const currentUnitError = assertUnits(payload.current_units, expectedCurrentUnits)
  const hourlyUnitError = assertUnits(payload.hourly_units, expectedHourlyUnits)
  const dailyUnitError = assertUnits(payload.daily_units, expectedDailyUnits)
  const unitError = currentUnitError ?? hourlyUnitError ?? dailyUnitError
  if (unitError) {
    return { ok: false, error: unitError }
  }

  const hourly = validateHourly(payload.hourly, notices)
  if (!hourly) {
    return {
      ok: false,
      error: typedError('MISSING_HOURLY', 'Open-Meteo hourly forecast block is missing required fields.'),
    }
  }

  const daily = validateDaily(payload.daily, notices)
  if (!daily) {
    return {
      ok: false,
      error: typedError('MISSING_DAILY', 'Open-Meteo daily forecast block is missing required fields.'),
    }
  }

  if (
    !isFiniteNumber(payload.latitude) ||
    !isFiniteNumber(payload.longitude) ||
    !isFiniteNumber(payload.utc_offset_seconds) ||
    typeof payload.timezone !== 'string'
  ) {
    return {
      ok: false,
      error: typedError('INVALID_SCHEMA', 'Open-Meteo response metadata is invalid.'),
    }
  }

  return {
    ok: true,
    data: {
      latitude: payload.latitude,
      longitude: payload.longitude,
      elevation: isFiniteNumber(payload.elevation) ? payload.elevation : null,
      generationtime_ms: isFiniteNumber(payload.generationtime_ms)
        ? payload.generationtime_ms
        : null,
      utc_offset_seconds: payload.utc_offset_seconds,
      timezone: payload.timezone,
      timezone_abbreviation:
        typeof payload.timezone_abbreviation === 'string'
          ? payload.timezone_abbreviation
          : null,
      current,
      hourly,
      daily,
    },
    notices,
  }
}
