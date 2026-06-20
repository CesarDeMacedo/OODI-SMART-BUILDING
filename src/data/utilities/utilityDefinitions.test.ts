import { describe, expect, it } from 'vitest'
import { getUtilityDefinition, utilityDefinitions } from './utilityDefinitions'

describe('utility definitions', () => {
  it('maps the four approved utilities to Nuuka reporting groups and canonical units', () => {
    expect(utilityDefinitions).toEqual([
      {
        id: 'electricity',
        reportingGroup: 'Electricity',
        displayName: 'Electricity',
        canonicalUnit: 'kWh',
        sourceUnitAliases: ['kWh', 'KWH', 'kwh'],
      },
      {
        id: 'heat',
        reportingGroup: 'Heat',
        displayName: 'Heat',
        canonicalUnit: 'kWh',
        sourceUnitAliases: ['kWh', 'KWH', 'kwh'],
      },
      {
        id: 'water',
        reportingGroup: 'Water',
        displayName: 'Water',
        canonicalUnit: 'm3',
        sourceUnitAliases: ['M3', 'm3', 'm³'],
      },
      {
        id: 'districtCooling',
        reportingGroup: 'DistrictCooling',
        displayName: 'District Cooling',
        canonicalUnit: 'kWh',
        sourceUnitAliases: ['kWh', 'KWH', 'kwh'],
      },
    ])
  })

  it('returns a utility definition by id', () => {
    expect(getUtilityDefinition('water').reportingGroup).toBe('Water')
  })
})
