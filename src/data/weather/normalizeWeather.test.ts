import { describe, expect, it } from 'vitest'
import partialFixture from './fixtures/openMeteo-partial.json'
import successFixture from './fixtures/openMeteo-success.json'
import { normalizeOpenMeteoWeather } from './normalizeWeather'
import { validateOpenMeteoPayload } from './weatherValidation'

function normalizeFixture(payload: unknown = successFixture) {
  const validation = validateOpenMeteoPayload(payload)
  if (!validation.ok) throw new Error(validation.error.message)

  return normalizeOpenMeteoWeather({
    validated: validation.data,
    validationNotices: validation.notices,
    endpoint: 'https://api.open-meteo.com/v1/forecast?example=true',
    retrievedAt: '2026-06-20T16:45:00.000Z',
    origin: 'network',
  })
}

describe('weather normalization', () => {
  it('normalizes current weather with distinct source and retrieval timestamps', () => {
    const result = normalizeFixture()

    expect(result.status).toBe('success')
    expect(result.weather.current.timestamp).toBe('2026-06-20T02:00:00')
    expect(result.weather.current.sourceTimestamp).toBe('2026-06-20T02:00')
    expect(result.weather.provider.retrievedAt).toBe('2026-06-20T16:45:00.000Z')
    expect(result.weather.provider.generationTimeMs).toBe(0.478)
    expect(result.weather.qualityNotices.map((notice) => notice.code)).toContain(
      'CURRENT_IS_MODELLED_CONTEXT',
    )
  })

  it('selects the next 24 index-aligned hourly points from the current timestamp', () => {
    const result = normalizeFixture()

    expect(result.weather.hourly).toHaveLength(24)
    expect(result.weather.hourly[0].sourceTimestamp).toBe('2026-06-20T02:00')
    expect(result.weather.hourly.at(-1)?.sourceTimestamp).toBe('2026-06-21T01:00')
  })

  it('selects up to 3 daily points from the current Helsinki date', () => {
    const result = normalizeFixture()

    expect(result.weather.daily).toHaveLength(3)
    expect(result.weather.daily.map((point) => point.sourceDate)).toEqual([
      '2026-06-20',
      '2026-06-21',
      '2026-06-22',
    ])
  })

  it('returns partial when hourly coverage is reduced by misaligned arrays', () => {
    const result = normalizeFixture(partialFixture)

    expect(result.status).toBe('partial')
    expect(result.weather.hourly).toHaveLength(2)
    expect(result.weather.qualityNotices.map((notice) => notice.code)).toContain(
      'HOURLY_FORECAST_PARTIAL',
    )
  })

  it('returns partial when daily coverage is reduced by misaligned arrays', () => {
    const result = normalizeFixture(partialFixture)

    expect(result.status).toBe('partial')
    expect(result.weather.daily).toHaveLength(2)
    expect(result.weather.qualityNotices.map((notice) => notice.code)).toContain(
      'DAILY_FORECAST_PARTIAL',
    )
  })

  it('maps unknown weather codes with a quality notice', () => {
    const payload = structuredClone(successFixture)
    payload.current.weather_code = 12345

    const result = normalizeFixture(payload)

    expect(result.weather.current.condition.id).toBe('unknown')
    expect(result.weather.qualityNotices.map((notice) => notice.code)).toContain(
      'UNKNOWN_WEATHER_CODE',
    )
  })
})
