import type { WeatherCondition } from './weatherTypes'

const conditionsByCode = new Map<number, WeatherCondition>([
  [0, { id: 'clear', label: 'Clear sky' }],
  [1, { id: 'mainly-clear', label: 'Mainly clear' }],
  [2, { id: 'partly-cloudy', label: 'Partly cloudy' }],
  [3, { id: 'overcast', label: 'Overcast' }],
  [45, { id: 'fog', label: 'Fog' }],
  [48, { id: 'rime-fog', label: 'Depositing rime fog' }],
  [51, { id: 'drizzle', label: 'Drizzle' }],
  [53, { id: 'drizzle', label: 'Drizzle' }],
  [55, { id: 'drizzle', label: 'Drizzle' }],
  [56, { id: 'freezing-drizzle', label: 'Freezing drizzle' }],
  [57, { id: 'freezing-drizzle', label: 'Freezing drizzle' }],
  [61, { id: 'rain', label: 'Rain' }],
  [63, { id: 'rain', label: 'Rain' }],
  [65, { id: 'rain', label: 'Rain' }],
  [66, { id: 'freezing-rain', label: 'Freezing rain' }],
  [67, { id: 'freezing-rain', label: 'Freezing rain' }],
  [71, { id: 'snow', label: 'Snow' }],
  [73, { id: 'snow', label: 'Snow' }],
  [75, { id: 'snow', label: 'Snow' }],
  [77, { id: 'snow-grains', label: 'Snow grains' }],
  [80, { id: 'rain-showers', label: 'Rain showers' }],
  [81, { id: 'rain-showers', label: 'Rain showers' }],
  [82, { id: 'rain-showers', label: 'Rain showers' }],
  [85, { id: 'snow-showers', label: 'Snow showers' }],
  [86, { id: 'snow-showers', label: 'Snow showers' }],
  [95, { id: 'thunderstorm', label: 'Thunderstorm' }],
  [96, { id: 'thunderstorm-hail', label: 'Thunderstorm with hail' }],
  [99, { id: 'thunderstorm-hail', label: 'Thunderstorm with hail' }],
])

export function getWeatherCondition(code: number): WeatherCondition {
  return conditionsByCode.get(code) ?? { id: 'unknown', label: 'Unknown weather condition' }
}
