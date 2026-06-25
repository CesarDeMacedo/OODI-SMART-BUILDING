import { describe, expect, it } from 'vitest'
import { deriveInsights } from './insightRules'
import type { UtilityLoadState, WeatherLoadState } from '../../app/useAppData'
import type { UtilityId, UtilitySeries } from '../../data/utilities/utilitySeries'

// ─── Fixtures ────────────────────────────────────────────────────────────────

const BASE_PERIOD = {
  requestedPeriod: '30d' as const,
  requestedGranularity: 'daily' as const,
  requestedWindow: { start: '2026-05-25T00:00:00', end: '2026-06-24T00:00:00' },
  effectiveGranularity: 'daily' as const,
  effectiveWindow: { start: '2026-05-25T00:00:00', end: '2026-06-24T00:00:00' },
  isFallback: false,
  fallbackReason: null as null,
  intendedRecordCount: 30,
  actualRecordCount: 0,
}

const BASE_PROVENANCE = {
  classification: 'real-public-building-data' as const,
  provider: 'Nuuka' as const,
  dataset: 'Helsinki public building energy data' as const,
  endpoint: null,
  retrievedAt: '2026-06-24T12:00:00',
  origin: 'network' as const,
}

function makeSeries(
  id: UtilityId,
  overrides: Partial<UtilitySeries> = {},
): UtilitySeries {
  return {
    utility: id,
    reportingGroup:
      id === 'electricity'
        ? 'Electricity'
        : id === 'heat'
          ? 'Heat'
          : id === 'water'
            ? 'Water'
            : 'DistrictCooling',
    displayName: id,
    unit: id === 'water' ? 'm3' : 'kWh',
    points: [],
    latestReading: null,
    period: BASE_PERIOD,
    provenance: BASE_PROVENANCE,
    qualityNotices: [],
    ...overrides,
  }
}

function loadingState(): UtilityLoadState {
  return { loading: true, result: null }
}

function successState(series: UtilitySeries): UtilityLoadState {
  return { loading: false, result: { status: 'success', series } }
}

function errorState(message = 'Network error'): UtilityLoadState {
  return {
    loading: false,
    result: {
      status: 'error',
      error: { code: 'NETWORK', message, retryable: true },
    },
  }
}

function noWeather(): WeatherLoadState {
  return { loading: false, result: null }
}

function weatherAt(temperatureC: number): WeatherLoadState {
  return {
    loading: false,
    result: {
      status: 'success',
      weather: {
        classification: 'current-public-weather-data',
        current: {
          timestamp: '2026-06-24T12:00:00',
          sourceTimestamp: '2026-06-24T12:00:00',
          temperatureC,
          apparentTemperatureC: temperatureC,
          relativeHumidityPercent: 60,
          precipitationMm: 0,
          weatherCode: 0,
          condition: { id: 'clear', label: 'Clear' },
          cloudCoverPercent: 0,
          windSpeedKmh: 5,
          windDirectionDegrees: 180,
          windGustKmh: 8,
          isDay: true,
        },
        hourly: [],
        daily: [],
        provider: {
          provider: 'Open-Meteo',
          endpoint: 'https://api.open-meteo.com',
          requestedLatitude: 60.173,
          requestedLongitude: 24.939,
          responseLatitude: 60.173,
          responseLongitude: 24.939,
          elevationMeters: null,
          timezone: 'Europe/Helsinki',
          timezoneAbbreviation: 'EEST',
          utcOffsetSeconds: 10800,
          generationTimeMs: null,
          retrievedAt: '2026-06-24T12:00:00',
          origin: 'network',
          attributionLabel: 'Open-Meteo',
          attributionUrl: 'https://open-meteo.com',
        },
        qualityNotices: [],
      },
    },
  }
}

const ALL_LOADING: Record<UtilityId, UtilityLoadState> = {
  electricity: loadingState(),
  heat: loadingState(),
  water: loadingState(),
  districtCooling: loadingState(),
}

const ALL_EMPTY_SUCCESS: Record<UtilityId, UtilityLoadState> = {
  electricity: successState(makeSeries('electricity')),
  heat: successState(makeSeries('heat')),
  water: successState(makeSeries('water')),
  districtCooling: successState(makeSeries('districtCooling')),
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('deriveInsights', () => {
  it('returns empty array when all utilities are loading', () => {
    expect(deriveInsights(ALL_LOADING, noWeather())).toEqual([])
  })

  it('returns empty array when all utilities succeed but have no data', () => {
    expect(deriveInsights(ALL_EMPTY_SUCCESS, noWeather())).toEqual([])
  })

  it('returns a priority-1 error item for an errored utility', () => {
    const utilities = { ...ALL_LOADING, electricity: errorState('API timeout') }
    const items = deriveInsights(utilities, noWeather())

    expect(items).toHaveLength(1)
    expect(items[0].priority).toBe(1)
    expect(items[0].kind).toBe('quality')
    expect(items[0].utility).toBe('electricity')
    expect(items[0].body).toContain('API timeout')
  })

  it('produces a priority-1 quality notice for SNAPSHOT_USED', () => {
    const series = makeSeries('heat', {
      qualityNotices: [{ code: 'SNAPSHOT_USED', message: 'Snapshot used' }],
    })
    const utilities = { ...ALL_EMPTY_SUCCESS, heat: successState(series) }
    const items = deriveInsights(utilities, noWeather())

    const notice = items.find((i) => i.id === 'heat-quality-SNAPSHOT_USED')
    expect(notice).toBeDefined()
    expect(notice?.priority).toBe(1)
    expect(notice?.kind).toBe('quality')
    expect(notice?.body).toContain('Heat')
    expect(notice?.body).toContain('cached public snapshot')
  })

  it('suppresses priority-2 fallback when SNAPSHOT_USED quality notice is present', () => {
    const series = makeSeries('electricity', {
      period: { ...BASE_PERIOD, isFallback: true, fallbackReason: 'requested-window-empty' },
      qualityNotices: [{ code: 'SNAPSHOT_USED', message: 'Snapshot' }],
    })
    const utilities = { ...ALL_EMPTY_SUCCESS, electricity: successState(series) }
    const items = deriveInsights(utilities, noWeather())

    const fallbackItem = items.find((i) => i.id === 'electricity-fallback')
    expect(fallbackItem).toBeUndefined()
  })

  it('produces a priority-2 fallback item when period.isFallback is true', () => {
    const series = makeSeries('water', {
      period: {
        ...BASE_PERIOD,
        isFallback: true,
        fallbackReason: 'requested-window-partial',
        effectiveWindow: { start: '2026-06-01T00:00:00', end: '2026-06-20T00:00:00' },
      },
    })
    const utilities = { ...ALL_EMPTY_SUCCESS, water: successState(series) }
    const items = deriveInsights(utilities, noWeather())

    const fallback = items.find((i) => i.id === 'water-fallback')
    expect(fallback).toBeDefined()
    expect(fallback?.priority).toBe(2)
    expect(fallback?.kind).toBe('fallback')
    expect(fallback?.body).toContain('30-day')
  })

  it('produces a priority-3 latest reading item when latestReading is present', () => {
    const series = makeSeries('electricity', {
      latestReading: {
        timestamp: '2026-06-23T23:00:00',
        sourceTimestamp: '2026-06-23T23:00:00',
        value: 1234.5,
      },
    })
    const utilities = { ...ALL_EMPTY_SUCCESS, electricity: successState(series) }
    const items = deriveInsights(utilities, noWeather())

    const reading = items.find((i) => i.id === 'electricity-latest')
    expect(reading).toBeDefined()
    expect(reading?.priority).toBe(3)
    expect(reading?.kind).toBe('reading')
    expect(reading?.body).toContain('1,234.5')
    expect(reading?.body).toContain('kWh')
  })

  it('does not mix kWh and m3 in the same insight item', () => {
    const elSeries = makeSeries('electricity', {
      latestReading: { timestamp: '2026-06-23T00:00:00', sourceTimestamp: '2026-06-23T00:00:00', value: 500 },
    })
    const waterSeries = makeSeries('water', {
      latestReading: { timestamp: '2026-06-23T00:00:00', sourceTimestamp: '2026-06-23T00:00:00', value: 100 },
    })
    const utilities = {
      ...ALL_EMPTY_SUCCESS,
      electricity: successState(elSeries),
      water: successState(waterSeries),
    }
    const items = deriveInsights(utilities, noWeather())

    for (const item of items) {
      if (item.body.includes('kWh') && item.body.includes('m3')) {
        throw new Error(`Item ${item.id} mixes kWh and m3 units`)
      }
    }
  })

  it('produces a heat-demand weather context item when temp ≤ 5 and heat data is available', () => {
    const heatSeries = makeSeries('heat', {
      latestReading: { timestamp: '2026-06-23T00:00:00', sourceTimestamp: '2026-06-23T00:00:00', value: 900 },
    })
    const utilities = { ...ALL_EMPTY_SUCCESS, heat: successState(heatSeries) }
    const items = deriveInsights(utilities, weatherAt(2))

    const wx = items.find((i) => i.id === 'weather-heat-context')
    expect(wx).toBeDefined()
    expect(wx?.priority).toBe(4)
    expect(wx?.kind).toBe('weather')
    expect(wx?.body).toContain('2.0°C')
    expect(wx?.body).toContain('coincides with')
    expect(wx?.body).not.toContain('caused by')
  })

  it('produces a cooling weather context item when temp ≥ 20 and districtCooling data is available', () => {
    const coolingSeries = makeSeries('districtCooling', {
      latestReading: { timestamp: '2026-06-23T00:00:00', sourceTimestamp: '2026-06-23T00:00:00', value: 400 },
    })
    const utilities = { ...ALL_EMPTY_SUCCESS, districtCooling: successState(coolingSeries) }
    const items = deriveInsights(utilities, weatherAt(24))

    const wx = items.find((i) => i.id === 'weather-cooling-context')
    expect(wx).toBeDefined()
    expect(wx?.body).toContain('24.0°C')
    expect(wx?.body).toContain('may provide context')
  })

  it('produces a general weather context item for mid-range temperatures', () => {
    const items = deriveInsights(ALL_EMPTY_SUCCESS, weatherAt(14))

    const wx = items.find((i) => i.id === 'weather-general')
    expect(wx).toBeDefined()
    expect(wx?.priority).toBe(4)
  })

  it('produces no weather item when weather is loading', () => {
    const items = deriveInsights(ALL_EMPTY_SUCCESS, { loading: true, result: null })
    const weatherItems = items.filter((i) => i.kind === 'weather')
    expect(weatherItems).toHaveLength(0)
  })

  it('produces a priority-5 summary item when points are present', () => {
    const series = makeSeries('electricity', {
      points: [
        { timestamp: '2026-06-01T00:00:00', sourceTimestamp: '2026-06-01T00:00:00', value: 100 },
        { timestamp: '2026-06-02T00:00:00', sourceTimestamp: '2026-06-02T00:00:00', value: 110 },
      ],
    })
    const utilities = { ...ALL_EMPTY_SUCCESS, electricity: successState(series) }
    const items = deriveInsights(utilities, noWeather())

    const summary = items.find((i) => i.id === 'electricity-summary')
    expect(summary).toBeDefined()
    expect(summary?.priority).toBe(5)
    expect(summary?.kind).toBe('summary')
    expect(summary?.body).toContain('2 data points')
  })

  it('returns identical output for identical inputs (deterministic)', () => {
    const series = makeSeries('electricity', {
      latestReading: { timestamp: '2026-06-23T00:00:00', sourceTimestamp: '2026-06-23T00:00:00', value: 999 },
      qualityNotices: [{ code: 'DELAYED_SOURCE_DATA', message: 'Delayed' }],
    })
    const utilities = { ...ALL_EMPTY_SUCCESS, electricity: successState(series) }
    const first = deriveInsights(utilities, weatherAt(12))
    const second = deriveInsights(utilities, weatherAt(12))
    expect(first).toEqual(second)
  })

  it('caps output at 12 items', () => {
    const series = (id: UtilityId) =>
      makeSeries(id, {
        points: Array.from({ length: 5 }, (_, i) => ({
          timestamp: `2026-06-0${i + 1}T00:00:00`,
          sourceTimestamp: `2026-06-0${i + 1}T00:00:00`,
          value: i * 10,
        })),
        latestReading: { timestamp: '2026-06-24T00:00:00', sourceTimestamp: '2026-06-24T00:00:00', value: 50 },
        qualityNotices: [
          { code: 'DELAYED_SOURCE_DATA', message: 'Delayed' },
          { code: 'PARTIAL_WINDOW', message: 'Partial' },
        ],
        period: { ...BASE_PERIOD, isFallback: true, fallbackReason: 'requested-window-partial' },
      })
    const utilities: Record<UtilityId, UtilityLoadState> = {
      electricity: successState(series('electricity')),
      heat: successState(series('heat')),
      water: successState(series('water')),
      districtCooling: successState(series('districtCooling')),
    }
    const items = deriveInsights(utilities, weatherAt(10))
    expect(items.length).toBeLessThanOrEqual(12)
  })

  it('sorts items by priority ascending', () => {
    const series = makeSeries('electricity', {
      points: [{ timestamp: '2026-06-01T00:00:00', sourceTimestamp: '2026-06-01T00:00:00', value: 1 }],
      latestReading: { timestamp: '2026-06-24T00:00:00', sourceTimestamp: '2026-06-24T00:00:00', value: 1 },
      qualityNotices: [{ code: 'DELAYED_SOURCE_DATA', message: 'Delayed' }],
    })
    const utilities = { ...ALL_EMPTY_SUCCESS, electricity: successState(series) }
    const items = deriveInsights(utilities, weatherAt(12))

    for (let i = 1; i < items.length; i++) {
      expect(items[i].priority).toBeGreaterThanOrEqual(items[i - 1].priority)
    }
  })
})
