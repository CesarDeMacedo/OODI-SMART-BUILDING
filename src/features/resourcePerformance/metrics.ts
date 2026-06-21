import type { UtilitySeries } from '../../data/utilities/utilitySeries'

export interface UtilityMetrics {
  average: number | null
  peak: { value: number; timestamp: string } | null
  latest: { value: number; timestamp: string } | null
  pointCount: number
}

export function getSeriesMetrics(series: UtilitySeries | undefined): UtilityMetrics {
  if (!series || series.points.length === 0) {
    return {
      average: null,
      peak: null,
      latest: null,
      pointCount: 0,
    }
  }

  let sum = 0
  let peak = series.points[0]

  for (const point of series.points) {
    sum += point.value
    if (point.value > peak.value) {
      peak = point
    }
  }

  return {
    average: sum / series.points.length,
    peak: { value: peak.value, timestamp: peak.sourceTimestamp },
    latest: series.latestReading
      ? {
          value: series.latestReading.value,
          timestamp: series.latestReading.sourceTimestamp,
        }
      : null,
    pointCount: series.points.length,
  }
}

export function formatMetricValue(value: number | null | undefined, unit: string) {
  if (value === null || value === undefined) {
    return 'n/a'
  }

  return `${value.toLocaleString(undefined, { maximumFractionDigits: 1 })} ${unit}`
}

export function getChartPath(series: UtilitySeries | undefined) {
  if (!series || series.points.length < 2) {
    return ''
  }

  const values = series.points.map((point) => point.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const width = 100
  const height = 44

  return series.points
    .map((point, index) => {
      const x = (index / (series.points.length - 1)) * width
      const y = height - ((point.value - min) / range) * height
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
    })
    .join(' ')
}
