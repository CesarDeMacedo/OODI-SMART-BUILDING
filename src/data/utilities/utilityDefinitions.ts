import type { UtilityDefinition, UtilityId } from './utilitySeries'

export const utilityDefinitions = [
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
] as const satisfies readonly UtilityDefinition[]

export function getUtilityDefinition(id: UtilityId): UtilityDefinition {
  const definition = utilityDefinitions.find((utility) => utility.id === id)

  if (!definition) {
    throw new Error(`Unsupported utility id: ${id}`)
  }

  return definition
}
