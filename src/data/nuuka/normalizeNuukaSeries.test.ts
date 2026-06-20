import { describe, expect, it } from 'vitest'
import { normalizeNuukaRows } from './normalizeNuukaSeries'

describe('Nuuka series normalization', () => {
  it('normalizes unit aliases and preserves minute-level water timestamps', () => {
    const result = normalizeNuukaRows({
      utility: 'water',
      granularity: 'hourly',
      rows: [{ timestamp: '2026-06-18T02:40', value: 1.5, unit: 'M3' }],
    })

    expect(result.unit).toBe('m3')
    expect(result.points[0]).toEqual({
      timestamp: '2026-06-18T02:40:00',
      sourceTimestamp: '2026-06-18T02:40',
      value: 1.5,
    })
    expect(result.qualityNotices.map((notice) => notice.code)).toEqual([
      'UNIT_ALIAS_NORMALIZED',
      'NON_HOURLY_TIMESTAMP',
    ])
  })

  it('sorts rows and calculates latest reading after deduplication', () => {
    const result = normalizeNuukaRows({
      utility: 'electricity',
      granularity: 'daily',
      rows: [
        { timestamp: '2026-05-17T00:00:00', value: 3, unit: 'kWh' },
        { timestamp: '2026-05-16T00:00:00', value: 2, unit: 'kWh' },
        { timestamp: '2026-05-16T00:00:00', value: 2, unit: 'kWh' },
      ],
    })

    expect(result.points.map((point) => point.timestamp)).toEqual([
      '2026-05-16T00:00:00',
      '2026-05-17T00:00:00',
    ])
    expect(result.latestReading?.value).toBe(3)
    expect(result.qualityNotices).toContainEqual({
      code: 'DUPLICATES_RESOLVED',
      message: 'Duplicate timestamps were resolved without fabricating values.',
      count: 1,
    })
  })

  it('keeps the last finite conflicting duplicate and emits a notice', () => {
    const result = normalizeNuukaRows({
      utility: 'heat',
      granularity: 'daily',
      rows: [
        { timestamp: '2026-05-16T00:00:00', value: 2, unit: 'kWh' },
        { timestamp: '2026-05-16T00:00:00', value: 4, unit: 'kWh' },
      ],
    })

    expect(result.points).toHaveLength(1)
    expect(result.points[0].value).toBe(4)
    expect(result.qualityNotices[0].code).toBe('DUPLICATES_RESOLVED')
  })

  it('preserves finite negative values and flags them as source adjustments', () => {
    const result = normalizeNuukaRows({
      utility: 'electricity',
      granularity: 'monthly',
      rows: [{ timestamp: '2026-05-17T00:00:00', value: -1, unit: 'kWh' }],
    })

    expect(result.points[0].value).toBe(-1)
    expect(result.qualityNotices).toContainEqual({
      code: 'NEGATIVE_VALUE_PRESENT',
      message: 'A finite negative source value was preserved; it may represent a correction or adjustment.',
      count: 1,
    })
  })

  it('reports unexpected units without normalizing points', () => {
    const result = normalizeNuukaRows({
      utility: 'water',
      granularity: 'daily',
      rows: [{ timestamp: '2026-05-17T00:00:00', value: 2, unit: 'liters' }],
    })

    expect(result.points).toEqual([])
    expect(result.qualityNotices[0].code).toBe('UNEXPECTED_UNIT')
  })
})
