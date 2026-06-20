import { describe, expect, it } from 'vitest'
import {
  canUseSnapshotForError,
  loadNuukaSnapshotSeries,
  validateSnapshotManifest,
} from './nuukaSnapshots'
import type { UtilityDataError } from '../utilities/utilitySeries'

describe('Nuuka snapshots', () => {
  it('allows snapshots only for the approved typed error policy', () => {
    const error = (code: UtilityDataError['code'], retryable = false): UtilityDataError => ({
      code,
      message: code,
      retryable,
    })

    expect(canUseSnapshotForError(error('NETWORK'))).toBe(true)
    expect(canUseSnapshotForError(error('TIMEOUT'))).toBe(true)
    expect(canUseSnapshotForError(error('HTTP', true))).toBe(true)
    expect(canUseSnapshotForError(error('INVALID_JSON'))).toBe(true)
    expect(canUseSnapshotForError(error('INVALID_SCHEMA'))).toBe(true)
    expect(canUseSnapshotForError(error('UNEXPECTED_UNIT'))).toBe(true)
    expect(canUseSnapshotForError(error('ABORTED'))).toBe(false)
    expect(canUseSnapshotForError(error('HTTP', false))).toBe(false)
  })

  it('validates a manifest entry without requiring placeholder coverage', () => {
    expect(
      validateSnapshotManifest({
        generatedAt: '2026-06-20T12:00:00',
        entries: [
          {
            id: 'water-monthly',
            utility: 'water',
            granularity: 'monthly',
            propertyCode: '091-002-0014-0005',
            generatedAt: '2026-06-20T12:00:00',
            sourceLatestTimestamp: '2026-06-18T00:00:00',
            unit: 'm3',
            file: 'water-monthly.json',
            pointCount: 2,
          },
        ],
      }).ok,
    ).toBe(true)
  })

  it('loads a labelled snapshot series from a validated manifest and file', async () => {
    const fetcher = async (input: string | URL | Request) => {
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
                pointCount: 2,
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
              { timestamp: '2026-06-17T00:00:00', sourceTimestamp: '2026-06-17T00:00:00', value: 1 },
              { timestamp: '2026-06-18T00:00:00', sourceTimestamp: '2026-06-18T00:00:00', value: 2 },
            ],
            latestReading: { timestamp: '2026-06-18T00:00:00', sourceTimestamp: '2026-06-18T00:00:00', value: 2 },
            qualityNotices: [],
          },
        }),
      )
    }

    const result = await loadNuukaSnapshotSeries({
      utility: 'water',
      period: '30d',
      granularity: 'daily',
      requestedWindow: { start: '2026-05-20', end: '2026-06-19' },
      retrievedAt: '2026-06-20T12:00:00',
      fallbackReason: 'network-unavailable-snapshot-used',
      fetcher,
    })

    expect(result?.status).toBe('success')
    if (result?.status !== 'success') throw new Error('expected snapshot success')
    expect(result.series.provenance.origin).toBe('snapshot')
    expect(result.series.provenance.snapshotGeneratedAt).toBe('2026-06-20T12:00:00')
    expect(result.series.qualityNotices.some((notice) => notice.code === 'SNAPSHOT_USED')).toBe(true)
  })
})
