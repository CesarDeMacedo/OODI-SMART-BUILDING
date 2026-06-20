import { describe, expect, it } from 'vitest'
import {
  getRequestedWindowForPeriod,
  toHelsinkiDateString,
} from './helsinkiCivilDate'

describe('Helsinki civil date helpers', () => {
  it('derives YYYY-MM-DD in Helsinki civil time', () => {
    expect(toHelsinkiDateString(new Date('2026-06-19T22:30:00Z'))).toBe('2026-06-20')
  })

  it('subtracts calendar days for the 30d window across DST start', () => {
    expect(getRequestedWindowForPeriod('30d', new Date('2026-03-29T12:00:00Z'))).toEqual({
      start: '2026-02-27',
      end: '2026-03-29',
    })
  })

  it('subtracts calendar months for the 12m window and clamps month length', () => {
    expect(getRequestedWindowForPeriod('12m', new Date('2026-03-31T12:00:00Z'))).toEqual({
      start: '2025-03-31',
      end: '2026-03-31',
    })
  })
})
