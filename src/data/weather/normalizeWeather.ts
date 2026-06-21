import { oodiConfig } from '../../config/oodi'
import { canonicalizeSourceTimestamp } from '../time/sourceTimestamp'
import {
  WEATHER_ATTRIBUTION_LABEL,
  WEATHER_ATTRIBUTION_URL,
} from './weatherDefinitions'
import { getWeatherCondition } from './weatherCode'
import type { ValidatedOpenMeteoPayload } from './weatherValidation'
import type {
  DailyWeatherPoint,
  HourlyWeatherPoint,
  WeatherOrigin,
  WeatherPackage,
  WeatherQualityNotice,
  WeatherResult,
} from './weatherTypes'

type NormalizeOpenMeteoWeatherRequest = {
  validated: ValidatedOpenMeteoPayload
  validationNotices: WeatherQualityNotice[]
  endpoint: string
  retrievedAt: string
  origin: WeatherOrigin
}

function addNotice(notices: WeatherQualityNotice[], notice: WeatherQualityNotice) {
  if (!notices.some((candidate) => candidate.code === notice.code && candidate.message === notice.message)) {
    notices.push(notice)
  }
}

function canonicalTimestamp(sourceTimestamp: string) {
  return canonicalizeSourceTimestamp(sourceTimestamp).timestamp
}

function weatherCodeNotice(code: number): WeatherQualityNotice {
  return {
    code: 'UNKNOWN_WEATHER_CODE',
    message: `Open-Meteo returned undocumented weather code ${code}.`,
  }
}

function conditionFor(code: number, notices: WeatherQualityNotice[]) {
  const condition = getWeatherCondition(code)
  if (condition.id === 'unknown') {
    addNotice(notices, weatherCodeNotice(code))
  }
  return condition
}

function selectHourlyPoints(
  validated: ValidatedOpenMeteoPayload,
  currentTimestamp: string,
  notices: WeatherQualityNotice[],
): HourlyWeatherPoint[] {
  const points: HourlyWeatherPoint[] = []

  for (let index = 0; index < validated.hourly.safeLength; index += 1) {
    const sourceTimestamp = validated.hourly.time[index]
    const timestamp = canonicalTimestamp(sourceTimestamp)
    if (timestamp < currentTimestamp) {
      continue
    }

    points.push({
      timestamp,
      sourceTimestamp,
      temperatureC: validated.hourly.temperature_2m[index],
      apparentTemperatureC: validated.hourly.apparent_temperature[index],
      relativeHumidityPercent: validated.hourly.relative_humidity_2m[index],
      precipitationProbabilityPercent: validated.hourly.precipitation_probability[index],
      precipitationMm: validated.hourly.precipitation[index],
      weatherCode: validated.hourly.weather_code[index],
      condition: conditionFor(validated.hourly.weather_code[index], notices),
      cloudCoverPercent: validated.hourly.cloud_cover[index],
      windSpeedKmh: validated.hourly.wind_speed_10m[index],
      windGustKmh: validated.hourly.wind_gusts_10m[index],
    })

    if (points.length === 24) {
      break
    }
  }

  if (points.length < 24) {
    addNotice(notices, {
      code: 'HOURLY_FORECAST_PARTIAL',
      message: 'Fewer than 24 index-aligned hourly forecast points are available.',
      count: points.length,
    })
  }

  return points
}

function selectDailyPoints(
  validated: ValidatedOpenMeteoPayload,
  currentDate: string,
  notices: WeatherQualityNotice[],
): DailyWeatherPoint[] {
  const points: DailyWeatherPoint[] = []

  for (let index = 0; index < validated.daily.safeLength; index += 1) {
    const sourceDate = validated.daily.time[index]
    if (sourceDate < currentDate) {
      continue
    }

    points.push({
      date: canonicalTimestamp(sourceDate),
      sourceDate,
      weatherCode: validated.daily.weather_code[index],
      condition: conditionFor(validated.daily.weather_code[index], notices),
      temperatureMaxC: validated.daily.temperature_2m_max[index],
      temperatureMinC: validated.daily.temperature_2m_min[index],
      apparentTemperatureMaxC: validated.daily.apparent_temperature_max[index],
      apparentTemperatureMinC: validated.daily.apparent_temperature_min[index],
      precipitationSumMm: validated.daily.precipitation_sum[index],
      precipitationProbabilityMaxPercent: validated.daily.precipitation_probability_max[index],
      windSpeedMaxKmh: validated.daily.wind_speed_10m_max[index],
      windGustMaxKmh: validated.daily.wind_gusts_10m_max[index],
      sunrise: canonicalTimestamp(validated.daily.sunrise[index]),
      sunset: canonicalTimestamp(validated.daily.sunset[index]),
    })

    if (points.length === 3) {
      break
    }
  }

  if (points.length < 3) {
    addNotice(notices, {
      code: 'DAILY_FORECAST_PARTIAL',
      message: 'Fewer than 3 index-aligned daily forecast points are available.',
      count: points.length,
    })
  }

  return points
}

export function normalizeOpenMeteoWeather({
  validated,
  validationNotices,
  endpoint,
  retrievedAt,
  origin,
}: NormalizeOpenMeteoWeatherRequest): Exclude<WeatherResult, { status: 'empty' | 'error' }> {
  const notices = [...validationNotices]
  const currentTimestamp = canonicalTimestamp(validated.current.time)
  const currentDate = currentTimestamp.slice(0, 10)

  addNotice(notices, {
    code: 'CURRENT_IS_MODELLED_CONTEXT',
    message: 'Open-Meteo current weather is model-derived public weather context, not an Oodi sensor reading.',
  })

  if (
    validated.latitude !== oodiConfig.weather.latitude ||
    validated.longitude !== oodiConfig.weather.longitude
  ) {
    addNotice(notices, {
      code: 'RESPONSE_COORDINATE_DIFFERENCE',
      message: 'Open-Meteo response coordinates identify the provider grid cell and differ from requested Oodi coordinates.',
    })
  }

  if (validated.timezone !== oodiConfig.weather.timezone) {
    addNotice(notices, {
      code: 'UNEXPECTED_TIMEZONE',
      message: `Open-Meteo returned timezone ${validated.timezone}.`,
    })
  }

  const currentCondition = conditionFor(validated.current.weather_code, notices)
  const weather: WeatherPackage = {
    classification: 'current-public-weather-data',
    current: {
      timestamp: currentTimestamp,
      sourceTimestamp: validated.current.time,
      temperatureC: validated.current.temperature_2m,
      apparentTemperatureC: validated.current.apparent_temperature,
      relativeHumidityPercent: validated.current.relative_humidity_2m,
      precipitationMm: validated.current.precipitation,
      weatherCode: validated.current.weather_code,
      condition: currentCondition,
      cloudCoverPercent: validated.current.cloud_cover,
      windSpeedKmh: validated.current.wind_speed_10m,
      windDirectionDegrees: validated.current.wind_direction_10m,
      windGustKmh: validated.current.wind_gusts_10m,
      isDay: validated.current.is_day === 1,
    },
    hourly: selectHourlyPoints(validated, currentTimestamp, notices),
    daily: selectDailyPoints(validated, currentDate, notices),
    provider: {
      provider: 'Open-Meteo',
      endpoint,
      requestedLatitude: oodiConfig.weather.latitude,
      requestedLongitude: oodiConfig.weather.longitude,
      responseLatitude: validated.latitude,
      responseLongitude: validated.longitude,
      elevationMeters: validated.elevation,
      timezone: 'Europe/Helsinki',
      timezoneAbbreviation: validated.timezone_abbreviation,
      utcOffsetSeconds: validated.utc_offset_seconds,
      generationTimeMs: validated.generationtime_ms,
      retrievedAt,
      origin,
      attributionLabel: WEATHER_ATTRIBUTION_LABEL,
      attributionUrl: WEATHER_ATTRIBUTION_URL,
    },
    qualityNotices: notices,
  }

  const isPartial =
    weather.hourly.length < 24 ||
    weather.daily.length < 3 ||
    notices.some(
      (notice) =>
        notice.code === 'HOURLY_FORECAST_PARTIAL' ||
        notice.code === 'DAILY_FORECAST_PARTIAL',
    )

  return isPartial
    ? {
        status: 'partial',
        weather,
        message: 'Open-Meteo returned partial forecast coverage.',
      }
    : { status: 'success', weather }
}
