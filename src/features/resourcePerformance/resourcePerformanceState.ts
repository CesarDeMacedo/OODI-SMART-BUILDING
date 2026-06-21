import { utilityDefinitions } from '../../data/utilities/utilityDefinitions'
import type { ProductPeriod } from '../../data/utilities/utilitySeries'

export const utilityOptions = utilityDefinitions

export const periodOptions: readonly { value: ProductPeriod; label: string; shortLabel: string }[] = [
  { value: '24h', label: '24 Hours', shortLabel: '24h' },
  { value: '30d', label: '30 Days', shortLabel: '30d' },
  { value: '12m', label: '12 Months', shortLabel: '12m' },
]

export function getPeriodLabel(period: ProductPeriod) {
  return periodOptions.find((option) => option.value === period)?.label ?? period
}
