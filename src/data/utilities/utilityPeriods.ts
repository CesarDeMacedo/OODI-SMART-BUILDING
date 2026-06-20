import type {
  Granularity,
  ProductPeriod,
  UtilityDataPoint,
} from './utilitySeries'

export interface PeriodDefinition {
  period: ProductPeriod
  granularity: Granularity
  intendedRecordCount: number
}

const periodDefinitions: Record<ProductPeriod, PeriodDefinition> = {
  '24h': {
    period: '24h',
    granularity: 'hourly',
    intendedRecordCount: 24,
  },
  '30d': {
    period: '30d',
    granularity: 'daily',
    intendedRecordCount: 30,
  },
  '12m': {
    period: '12m',
    granularity: 'monthly',
    intendedRecordCount: 12,
  },
}

export function getPeriodDefinition(period: ProductPeriod) {
  return periodDefinitions[period]
}

export function selectLatestPoints(points: UtilityDataPoint[], count: number) {
  return points.slice(Math.max(0, points.length - count))
}
