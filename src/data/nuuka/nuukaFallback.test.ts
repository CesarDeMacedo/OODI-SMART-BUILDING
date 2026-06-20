import { describe, expect, it } from 'vitest'
import { resolveNuukaSeries } from './nuukaFallback'

describe('Nuuka fallback resolution', () => {
  it('keeps electricity fallback at the requested hourly granularity', async () => {
    const responses = new Map<string, unknown>([
      ['hourly:2026-05-20:2026-06-19', []],
      [
        'monthly:2018-01-01:2026-06-19',
        [{ timestamp: '2026-05-17T00:00:00', value: 10, unit: 'kWh' }],
      ],
      [
        'hourly:2026-04-18:2026-05-18',
        [
          { timestamp: '2026-05-17T01:00:00', value: 1, unit: 'kWh' },
          { timestamp: '2026-05-17T02:00:00', value: 2, unit: 'kWh' },
        ],
      ],
    ])

    const result = await resolveNuukaSeries({
      utility: 'electricity',
      period: '24h',
      requestedWindow: { start: '2026-05-20', end: '2026-06-19' },
      fetchPayload: async ({ granularity, start, end }) =>
        responses.get(`${granularity}:${start}:${end}`) ?? [],
      retrievedAt: '2026-06-20T12:00:00',
    })

    expect(result.status).toBe('success')
    if (result.status !== 'success') {
      throw new Error('expected success')
    }
    expect(result.series.period.requestedGranularity).toBe('hourly')
    expect(result.series.period.effectiveGranularity).toBe('hourly')
    expect(result.series.period.isFallback).toBe(true)
    expect(result.series.latestReading?.timestamp).toBe('2026-05-17T02:00:00')
  })

  it('returns empty when same-granularity fallback has no rows', async () => {
    const result = await resolveNuukaSeries({
      utility: 'electricity',
      period: '30d',
      requestedWindow: { start: '2026-05-20', end: '2026-06-19' },
      fetchPayload: async ({ granularity }) =>
        granularity === 'monthly'
          ? [{ timestamp: '2026-05-17T00:00:00', value: 10, unit: 'kWh' }]
          : [],
      retrievedAt: '2026-06-20T12:00:00',
    })

    expect(result.status).toBe('empty')
    if (result.status !== 'empty') {
      throw new Error('expected empty')
    }
    expect(result.series.period.effectiveWindow).toBeNull()
  })
})
