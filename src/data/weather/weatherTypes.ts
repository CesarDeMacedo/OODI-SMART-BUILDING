export type WeatherDataClassification = 'current-public-weather-data'

export type WeatherTemporalClass = 'current' | 'hourly-forecast' | 'daily-forecast'

export type TemperatureUnit = 'celsius'
export type WindSpeedUnit = 'km/h'
export type PrecipitationUnit = 'mm'
export type HumidityUnit = 'percent'
export type PressureUnit = 'hPa'
export type DirectionUnit = 'degree'

export type WeatherConditionId =
  | 'clear'
  | 'mainly-clear'
  | 'partly-cloudy'
  | 'overcast'
  | 'fog'
  | 'rime-fog'
  | 'drizzle'
  | 'freezing-drizzle'
  | 'rain'
  | 'freezing-rain'
  | 'snow'
  | 'snow-grains'
  | 'rain-showers'
  | 'snow-showers'
  | 'thunderstorm'
  | 'thunderstorm-hail'
  | 'unknown'

export interface WeatherCondition {
  id: WeatherConditionId
  label: string
}

export interface CurrentWeather {
  timestamp: string
  sourceTimestamp: string
  temperatureC: number
  apparentTemperatureC: number
  relativeHumidityPercent: number
  precipitationMm: number
  weatherCode: number
  condition: WeatherCondition
  cloudCoverPercent: number
  windSpeedKmh: number
  windDirectionDegrees: number
  windGustKmh: number
  isDay: boolean
}

export interface HourlyWeatherPoint {
  timestamp: string
  sourceTimestamp: string
  temperatureC: number
  apparentTemperatureC: number
  relativeHumidityPercent: number
  precipitationProbabilityPercent: number | null
  precipitationMm: number
  weatherCode: number
  condition: WeatherCondition
  cloudCoverPercent: number
  windSpeedKmh: number
  windGustKmh: number
}

export interface DailyWeatherPoint {
  date: string
  sourceDate: string
  weatherCode: number
  condition: WeatherCondition
  temperatureMaxC: number
  temperatureMinC: number
  apparentTemperatureMaxC: number
  apparentTemperatureMinC: number
  precipitationSumMm: number
  precipitationProbabilityMaxPercent: number | null
  windSpeedMaxKmh: number
  windGustMaxKmh: number
  sunrise: string
  sunset: string
}

export type WeatherOrigin = 'network' | 'memory-cache'

export interface WeatherProviderMetadata {
  provider: 'Open-Meteo'
  endpoint: string
  requestedLatitude: number
  requestedLongitude: number
  responseLatitude: number
  responseLongitude: number
  elevationMeters: number | null
  timezone: 'Europe/Helsinki'
  timezoneAbbreviation: string | null
  utcOffsetSeconds: number
  generationTimeMs: number | null
  retrievedAt: string
  origin: WeatherOrigin
  attributionLabel: string
  attributionUrl: string
}

export type WeatherQualityNoticeCode =
  | 'CURRENT_TIMESTAMP_DELAYED'
  | 'HOURLY_FORECAST_PARTIAL'
  | 'DAILY_FORECAST_PARTIAL'
  | 'UNKNOWN_WEATHER_CODE'
  | 'OPTIONAL_FIELD_MISSING'
  | 'RESPONSE_COORDINATE_DIFFERENCE'
  | 'UNEXPECTED_TIMEZONE'
  | 'UNIT_ALIAS_NORMALIZED'
  | 'CURRENT_IS_MODELLED_CONTEXT'

export interface WeatherQualityNotice {
  code: WeatherQualityNoticeCode
  message: string
  count?: number
}

export interface WeatherPackage {
  classification: WeatherDataClassification
  current: CurrentWeather
  hourly: HourlyWeatherPoint[]
  daily: DailyWeatherPoint[]
  provider: WeatherProviderMetadata
  qualityNotices: WeatherQualityNotice[]
}

export type WeatherDataErrorCode =
  | 'ABORTED'
  | 'TIMEOUT'
  | 'NETWORK'
  | 'HTTP'
  | 'INVALID_JSON'
  | 'INVALID_SCHEMA'
  | 'UNEXPECTED_UNIT'
  | 'MISSING_CURRENT'
  | 'MISSING_HOURLY'
  | 'MISSING_DAILY'
  | 'UNKNOWN'

export interface WeatherDataError {
  code: WeatherDataErrorCode
  message: string
  retryable: boolean
  statusCode?: number
  cause?: unknown
}

export type WeatherResult =
  | { status: 'success'; weather: WeatherPackage }
  | { status: 'partial'; weather: WeatherPackage; message: string }
  | { status: 'empty'; message: string; provider?: Partial<WeatherProviderMetadata> }
  | { status: 'error'; error: WeatherDataError; previousWeather?: WeatherPackage }

export interface WeatherRequest {
  refresh?: 'default' | 'force'
  signal?: AbortSignal
}

export interface WeatherRepository {
  getWeather(request?: WeatherRequest): Promise<WeatherResult>
  invalidate(): void
}
