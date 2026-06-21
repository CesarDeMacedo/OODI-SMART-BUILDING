import { describe, expect, it } from 'vitest'
import { oodiConfig } from '../../config/oodi'
import { buildOpenMeteoForecastUrl } from './weatherEndpoints'
import {
  OPEN_METEO_BASE_URL,
  currentWeatherVariables,
  dailyWeatherVariables,
  hourlyWeatherVariables,
} from './weatherDefinitions'

describe('Open-Meteo endpoint builder', () => {
  it('builds the Stage 3 forecast URL from central Oodi coordinates', () => {
    const url = new URL(buildOpenMeteoForecastUrl())

    expect(url.origin + url.pathname).toBe(OPEN_METEO_BASE_URL)
    expect(url.searchParams.get('latitude')).toBe(String(oodiConfig.weather.latitude))
    expect(url.searchParams.get('longitude')).toBe(String(oodiConfig.weather.longitude))
    expect(url.searchParams.get('timezone')).toBe('Europe/Helsinki')
    expect(url.searchParams.get('forecast_days')).toBe('3')
    expect(url.searchParams.get('current')).toBe(currentWeatherVariables.join(','))
    expect(url.searchParams.get('hourly')).toBe(hourlyWeatherVariables.join(','))
    expect(url.searchParams.get('daily')).toBe(dailyWeatherVariables.join(','))
  })
})
