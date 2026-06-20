import { describe, expect, it, vi } from 'vitest'
import { createUtilityRepository } from './utilityRepository'

describe('utility repository', () => {
  it('returns a normalized series through the application-facing API', async () => {
    const repository = createUtilityRepository({
      fetchPayload: async () => [
        { timestamp: '2026-06-18T00:00:00', value: 2, unit: 'M3' },
      ],
      now: () => new Date('2026-06-20T12:00:00Z'),
      retrievedAt: () => '2026-06-20T12:00:00',
    })

    const result = await repository.getSeries({ utility: 'water', period: '30d' })

    expect(result.status).toBe('success')
    if (result.status !== 'success') throw new Error('expected success')
    expect(result.series.utility).toBe('water')
    expect(result.series.unit).toBe('m3')
    expect(result.series.latestReading?.sourceTimestamp).toBe('2026-06-18T00:00:00')
  })

  it('reuses identical cached repository requests and labels the second result as memory cache', async () => {
    const fetchPayload = vi.fn(async () => [
      { timestamp: '2026-06-18T00:00:00', value: 2, unit: 'M3' },
    ])
    const repository = createUtilityRepository({
      fetchPayload,
      now: () => new Date('2026-06-20T12:00:00Z'),
      retrievedAt: () => '2026-06-20T12:00:00',
    })

    const first = await repository.getSeries({ utility: 'water', period: '30d' })
    const second = await repository.getSeries({ utility: 'water', period: '30d' })

    expect(fetchPayload).toHaveBeenCalledTimes(1)
    expect(first.status).toBe('success')
    expect(second.status).toBe('success')
    if (first.status !== 'success' || second.status !== 'success') {
      throw new Error('expected success')
    }
    expect(first.series.provenance.origin).toBe('network')
    expect(second.series.provenance.origin).toBe('memory-cache')
    expect(second.series.provenance.retrievedAt).toBe(first.series.provenance.retrievedAt)
    expect(second.series.latestReading?.sourceTimestamp).toBe(first.series.latestReading?.sourceTimestamp)
  })

  it('labels force refresh as network after a completed cache hit', async () => {
    const fetchPayload = vi.fn(async () => [
      { timestamp: '2026-06-18T00:00:00', value: 2, unit: 'M3' },
    ])
    const repository = createUtilityRepository({
      fetchPayload,
      now: () => new Date('2026-06-20T12:00:00Z'),
      retrievedAt: () => '2026-06-20T12:00:00',
    })

    await repository.getSeries({ utility: 'water', period: '30d' })
    await repository.getSeries({ utility: 'water', period: '30d' })
    const refreshed = await repository.getSeries({
      utility: 'water',
      period: '30d',
      refresh: 'force',
    })

    expect(fetchPayload).toHaveBeenCalledTimes(2)
    expect(refreshed.status).toBe('success')
    if (refreshed.status !== 'success') throw new Error('expected success')
    expect(refreshed.series.provenance.origin).toBe('network')
  })

  it('returns typed errors instead of throwing network failures', async () => {
    const repository = createUtilityRepository({
      fetchPayload: async () => {
        throw {
          code: 'NETWORK',
          message: 'Nuuka network request failed.',
          retryable: true,
        }
      },
      now: () => new Date('2026-06-20T12:00:00Z'),
      retrievedAt: () => '2026-06-20T12:00:00',
    })

    const result = await repository.getSeries({ utility: 'water', period: '30d' })

    expect(result.status).toBe('error')
    if (result.status !== 'error') throw new Error('expected error')
    expect(result.error).toMatchObject({ code: 'NETWORK', retryable: true })
  })

  it('uses an authentic snapshot fallback shape for eligible technical errors', async () => {
    const snapshotFetcher = async (input: string | URL | Request) => {
      const url = String(input)

      if (url.endsWith('manifest.json')) {
        return new Response(
          JSON.stringify({
            generatedAt: '2026-06-20T12:00:00',
            entries: [
              {
                id: 'water-daily',
                utility: 'water',
                granularity: 'daily',
                propertyCode: '091-002-0014-0005',
                generatedAt: '2026-06-20T12:00:00',
                sourceLatestTimestamp: '2026-06-18T00:00:00',
                unit: 'm3',
                file: 'water-daily.json',
                pointCount: 1,
              },
            ],
          }),
        )
      }

      return new Response(
        JSON.stringify({
          source: {
            endpoint: 'https://example.test/water',
            generatedAt: '2026-06-20T12:00:00',
            propertyCode: '091-002-0014-0005',
            utility: 'water',
            granularity: 'daily',
          },
          series: {
            utility: 'water',
            reportingGroup: 'Water',
            displayName: 'Water',
            granularity: 'daily',
            unit: 'm3',
            points: [
              { timestamp: '2026-06-18T00:00:00', sourceTimestamp: '2026-06-18T00:00:00', value: 2 },
            ],
            latestReading: { timestamp: '2026-06-18T00:00:00', sourceTimestamp: '2026-06-18T00:00:00', value: 2 },
            qualityNotices: [],
          },
        }),
      )
    }
    const repository = createUtilityRepository({
      fetchPayload: async () => {
        throw {
          code: 'NETWORK',
          message: 'Nuuka network request failed.',
          retryable: true,
        }
      },
      snapshotFetcher,
      now: () => new Date('2026-06-20T12:00:00Z'),
      retrievedAt: () => '2026-06-20T12:00:00',
    })

    const result = await repository.getSeries({ utility: 'water', period: '30d' })

    expect(result.status).toBe('success')
    if (result.status !== 'success') throw new Error('expected snapshot success')
    expect(result.series.provenance.origin).toBe('snapshot')
    expect(result.series.period.fallbackReason).toBe('network-unavailable-snapshot-used')
  })

  it('returns aborted when the caller signal is already aborted', async () => {
    const controller = new AbortController()
    controller.abort()
    const fetchPayload = vi.fn()
    const repository = createUtilityRepository({
      fetchPayload,
      now: () => new Date('2026-06-20T12:00:00Z'),
      retrievedAt: () => '2026-06-20T12:00:00',
    })

    const result = await repository.getSeries({
      utility: 'water',
      period: '30d',
      signal: controller.signal,
    })

    expect(result.status).toBe('error')
    if (result.status !== 'error') throw new Error('expected error')
    expect(result.error.code).toBe('ABORTED')
    expect(fetchPayload).not.toHaveBeenCalled()
  })
})
