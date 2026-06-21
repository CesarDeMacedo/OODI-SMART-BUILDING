import { oodiConfig } from '../../config/oodi'
import {
  OPEN_METEO_BASE_URL,
  FORECAST_DAYS,
  currentWeatherVariables,
  dailyWeatherVariables,
  hourlyWeatherVariables,
} from './weatherDefinitions'

export function buildOpenMeteoForecastUrl() {
  const url = new URL(OPEN_METEO_BASE_URL)

  url.searchParams.set('latitude', String(oodiConfig.weather.latitude))
  url.searchParams.set('longitude', String(oodiConfig.weather.longitude))
  url.searchParams.set('current', currentWeatherVariables.join(','))
  url.searchParams.set('hourly', hourlyWeatherVariables.join(','))
  url.searchParams.set('daily', dailyWeatherVariables.join(','))
  url.searchParams.set('timezone', oodiConfig.weather.timezone)
  url.searchParams.set('forecast_days', String(FORECAST_DAYS))

  return url.toString()
}
