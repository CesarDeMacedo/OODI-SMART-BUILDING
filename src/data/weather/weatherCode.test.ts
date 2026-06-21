import { describe, expect, it } from 'vitest'
import { getWeatherCondition } from './weatherCode'

describe('weather code mapping', () => {
  it('maps documented WMO weather codes to stable labels', () => {
    expect(getWeatherCondition(0)).toEqual({ id: 'clear', label: 'Clear sky' })
    expect(getWeatherCondition(61)).toEqual({ id: 'rain', label: 'Rain' })
    expect(getWeatherCondition(96)).toEqual({
      id: 'thunderstorm-hail',
      label: 'Thunderstorm with hail',
    })
  })

  it('maps unknown codes without throwing', () => {
    expect(getWeatherCondition(12345)).toEqual({
      id: 'unknown',
      label: 'Unknown weather condition',
    })
  })
})
