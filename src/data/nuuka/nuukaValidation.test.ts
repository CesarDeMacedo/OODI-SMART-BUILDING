import { describe, expect, it } from 'vitest'
import { validateNuukaEnergyPayload } from './nuukaValidation'

describe('Nuuka energy validation', () => {
  it('accepts a raw Nuuka success array and drops malformed rows', () => {
    const result = validateNuukaEnergyPayload([
      { timestamp: '2026-06-18T02:40:00', value: 12.5, unit: 'M3' },
      { timestamp: null, value: 1, unit: 'M3' },
    ])

    expect(result.kind).toBe('rows')
    if (result.kind !== 'rows') throw new Error('expected rows')
    expect(result.invalidRowCount).toBe(1)
    expect(result.rows).toEqual([
      { timestamp: '2026-06-18T02:40:00', value: 12.5, unit: 'M3' },
    ])
  })

  it('recognizes a Nuuka error payload', () => {
    expect(
      validateNuukaEnergyPayload({
        errorNote: 'No data found with the given parameters',
        errorCode: 'MissingSettingsException',
      }),
    ).toEqual({
      kind: 'nuuka-error',
      error: {
        errorNote: 'No data found with the given parameters',
        errorCode: 'MissingSettingsException',
      },
    })
  })

  it('rejects unsafe top-level schemas', () => {
    expect(validateNuukaEnergyPayload({ rows: [] })).toEqual({
      kind: 'invalid-schema',
      message: 'Nuuka energy payload was neither an array nor a Nuuka error object.',
    })
  })
})
