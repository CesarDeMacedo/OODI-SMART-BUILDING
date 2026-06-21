export const OPEN_METEO_BASE_URL = 'https://api.open-meteo.com/v1/forecast'

export const WEATHER_ATTRIBUTION_LABEL = 'Weather data by Open-Meteo'

export const WEATHER_ATTRIBUTION_URL = 'https://open-meteo.com/'

export const WEATHER_STRATEGY_VERSION = 'open-meteo-v1-current-24h-3d'

export const WEATHER_CACHE_TTL_MS = 10 * 60 * 1000

export const WEATHER_EMPTY_CACHE_TTL_MS = 2 * 60 * 1000

export const FORECAST_DAYS = 3

export const currentWeatherVariables = [
  'temperature_2m',
  'apparent_temperature',
  'relative_humidity_2m',
  'precipitation',
  'weather_code',
  'cloud_cover',
  'wind_speed_10m',
  'wind_direction_10m',
  'wind_gusts_10m',
  'is_day',
] as const

export const hourlyWeatherVariables = [
  'temperature_2m',
  'apparent_temperature',
  'relative_humidity_2m',
  'precipitation_probability',
  'precipitation',
  'weather_code',
  'cloud_cover',
  'wind_speed_10m',
  'wind_gusts_10m',
] as const

export const dailyWeatherVariables = [
  'weather_code',
  'temperature_2m_max',
  'temperature_2m_min',
  'apparent_temperature_max',
  'apparent_temperature_min',
  'precipitation_sum',
  'precipitation_probability_max',
  'wind_speed_10m_max',
  'wind_gusts_10m_max',
  'sunrise',
  'sunset',
] as const
