import { describe, expect, it } from 'vitest'
import { buildNuukaEnergyUrl } from './nuukaEndpoints'

describe('Nuuka endpoint builder', () => {
  it('builds daily energy URLs with the verified Oodi property identity', () => {
    const url = new URL(
      buildNuukaEnergyUrl({
        reportingGroup: 'Water',
        granularity: 'daily',
        start: '2026-05-20',
        end: '2026-06-19',
      }),
    )

    expect(url.origin).toBe('https://helsinki-openapi.nuuka.cloud')
    expect(url.pathname).toBe('/api/v1.0/EnergyData/Daily/ListByProperty')
    expect(url.searchParams.get('Record')).toBe('LocationName')
    expect(url.searchParams.get('SearchString')).toBe('4669 Oodi Helsingin keskustakirjasto')
    expect(url.searchParams.get('ReportingGroup')).toBe('Water')
    expect(url.searchParams.get('StartTime')).toBe('2026-05-20')
    expect(url.searchParams.get('EndTime')).toBe('2026-06-19')
    expect(url.searchParams.has('Normalization')).toBe(false)
  })

  it('adds Normalization=false only for monthly URLs', () => {
    const url = new URL(
      buildNuukaEnergyUrl({
        reportingGroup: 'Electricity',
        granularity: 'monthly',
        start: '2018-01-01',
        end: '2026-06-19',
      }),
    )

    expect(url.pathname).toBe('/api/v1.0/EnergyData/Monthly/ListByProperty')
    expect(url.searchParams.get('Normalization')).toBe('false')
  })
})
