import { describe, expect, it } from 'vitest'
import { compareSourceTimestamps, canonicalizeSourceTimestamp } from './sourceTimestamp'

describe('source timestamp handling', () => {
  it('canonicalizes Nuuka timestamps without adding UTC markers', () => {
    expect(canonicalizeSourceTimestamp('2026-06-18T02:40')).toEqual({
      timestamp: '2026-06-18T02:40:00',
      sourceTimestamp: '2026-06-18T02:40',
    })
    expect(canonicalizeSourceTimestamp('2026-05-31T00:00:00').timestamp).toBe(
      '2026-05-31T00:00:00',
    )
    expect(canonicalizeSourceTimestamp('2026-05-31').timestamp).toBe(
      '2026-05-31T00:00:00',
    )
  })

  it('compares canonical timestamps lexically after normalization', () => {
    expect(compareSourceTimestamps('2026-06-18T02:40', '2026-06-18T02:39:59')).toBe(1)
    expect(compareSourceTimestamps('2026-06-18', '2026-06-18T00:00')).toBe(0)
  })

  it('rejects unsafe timestamp formats', () => {
    expect(() => canonicalizeSourceTimestamp('2026/06/18 02:40')).toThrow(
      /Invalid Nuuka timestamp/,
    )
  })
})
