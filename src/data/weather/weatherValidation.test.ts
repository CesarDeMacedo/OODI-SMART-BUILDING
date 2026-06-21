import { describe, expect, it } from 'vitest'
import successFixture from './fixtures/openMeteo-success.json'
import invalidFixture from './fixtures/openMeteo-invalid.json'
import { validateOpenMeteoPayload } from './weatherValidation'

describe('Open-Meteo validation', () => {
  it('validates the authentic success response shape', () => {
    const result = validateOpenMeteoPayload(successFixture)

    expect(result.ok).toBe(true)
    if (!result.ok) throw new Error('expected valid payload')
    expect(result.data.current.time).toBe('2026-06-20T02:00')
    expect(result.data.hourly.time).toHaveLength(26)
    expect(result.data.daily.time).toHaveLength(3)
  })

  it('rejects missing required current fields', () => {
    const result = validateOpenMeteoPayload(invalidFixture)

    expect(result.ok).toBe(false)
    if (result.ok) throw new Error('expected invalid payload')
    expect(result.error.code).toBe('MISSING_CURRENT')
  })

  it('rejects unexpected units', () => {
    const payload = structuredClone(successFixture)
    payload.current_units.temperature_2m = 'K'

    const result = validateOpenMeteoPayload(payload)

    expect(result.ok).toBe(false)
    if (result.ok) throw new Error('expected invalid payload')
    expect(result.error.code).toBe('UNEXPECTED_UNIT')
  })

  it('marks misaligned hourly arrays instead of silently truncating', () => {
    const payload = structuredClone(successFixture)
    payload.hourly.wind_gusts_10m = payload.hourly.wind_gusts_10m.slice(0, 25)

    const result = validateOpenMeteoPayload(payload)

    expect(result.ok).toBe(true)
    if (!result.ok) throw new Error('expected valid partial payload')
    expect(result.data.hourly.time).toHaveLength(26)
    expect(result.data.hourly.safeLength).toBe(25)
    expect(result.notices.map((notice) => notice.code)).toContain('HOURLY_FORECAST_PARTIAL')
  })

  it('marks misaligned daily arrays instead of silently truncating', () => {
    const payload = structuredClone(successFixture)
    payload.daily.sunset = payload.daily.sunset.slice(0, 2)

    const result = validateOpenMeteoPayload(payload)

    expect(result.ok).toBe(true)
    if (!result.ok) throw new Error('expected valid partial payload')
    expect(result.data.daily.time).toHaveLength(3)
    expect(result.data.daily.safeLength).toBe(2)
    expect(result.notices.map((notice) => notice.code)).toContain('DAILY_FORECAST_PARTIAL')
  })
})
