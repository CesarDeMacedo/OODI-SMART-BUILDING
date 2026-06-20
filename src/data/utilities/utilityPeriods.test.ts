import { describe, expect, it } from 'vitest'
import { getPeriodDefinition, selectLatestPoints } from './utilityPeriods'

describe('utility periods', () => {
  it('maps product periods to approved granularities and intended counts', () => {
    expect(getPeriodDefinition('24h')).toEqual({
      period: '24h',
      granularity: 'hourly',
      intendedRecordCount: 24,
    })
    expect(getPeriodDefinition('30d').granularity).toBe('daily')
    expect(getPeriodDefinition('12m').intendedRecordCount).toBe(12)
  })

  it('selects the latest N sorted points without fabricating missing values', () => {
    const points = Array.from({ length: 35 }, (_, index) => ({
      timestamp: `2026-05-${String(index + 1).padStart(2, '0')}T00:00:00`,
      sourceTimestamp: `2026-05-${String(index + 1).padStart(2, '0')}T00:00:00`,
      value: index,
    }))

    expect(selectLatestPoints(points, 30)[0].timestamp).toBe('2026-05-06T00:00:00')
    expect(selectLatestPoints(points, 30)).toHaveLength(30)
  })
})
