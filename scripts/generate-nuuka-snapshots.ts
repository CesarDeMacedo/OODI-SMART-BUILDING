import { mkdir, writeFile } from 'node:fs/promises'

type UtilityId = 'electricity' | 'heat' | 'water' | 'districtCooling'
type Granularity = 'hourly' | 'daily' | 'monthly'
type UtilityUnit = 'kWh' | 'm3'

type UtilityDefinition = {
  id: UtilityId
  reportingGroup: 'Electricity' | 'Heat' | 'Water' | 'DistrictCooling'
  displayName: string
  canonicalUnit: UtilityUnit
  sourceUnitAliases: readonly string[]
}

type NuukaEnergyRow = {
  timestamp: string
  value: number
  unit: string
}

type NormalizedPoint = {
  timestamp: string
  sourceTimestamp: string
  value: number
}

const NUUKA_BASE_URL = 'https://helsinki-openapi.nuuka.cloud/api/v1.0'
const SNAPSHOT_DIR = new URL('../public/data/nuuka/snapshots/', import.meta.url)
const OODI = {
  locationName: '4669 Oodi Helsingin keskustakirjasto',
  propertyCode: '091-002-0014-0005',
}

const UTILITY_DEFINITIONS: readonly UtilityDefinition[] = [
  {
    id: 'electricity',
    reportingGroup: 'Electricity',
    displayName: 'Electricity',
    canonicalUnit: 'kWh',
    sourceUnitAliases: ['kWh', 'KWH'],
  },
  {
    id: 'heat',
    reportingGroup: 'Heat',
    displayName: 'Heat',
    canonicalUnit: 'kWh',
    sourceUnitAliases: ['kWh', 'KWH'],
  },
  {
    id: 'water',
    reportingGroup: 'Water',
    displayName: 'Water',
    canonicalUnit: 'm3',
    sourceUnitAliases: ['m3', 'M3', 'm³'],
  },
  {
    id: 'districtCooling',
    reportingGroup: 'DistrictCooling',
    displayName: 'District Cooling',
    canonicalUnit: 'kWh',
    sourceUnitAliases: ['kWh', 'KWH'],
  },
]

const GRANULARITIES = ['hourly', 'daily', 'monthly'] as const satisfies readonly Granularity[]

function endpointPath(granularity: Granularity) {
  const segment = granularity[0].toUpperCase() + granularity.slice(1)
  return `/EnergyData/${segment}/ListByProperty`
}

function buildNuukaEnergyUrl(definition: UtilityDefinition, granularity: Granularity, start: string, end: string) {
  const url = new URL(`${NUUKA_BASE_URL}${endpointPath(granularity)}`)
  url.searchParams.set('Record', 'LocationName')
  url.searchParams.set('SearchString', OODI.locationName)
  url.searchParams.set('ReportingGroup', definition.reportingGroup)
  url.searchParams.set('StartTime', start)
  url.searchParams.set('EndTime', end)

  if (granularity === 'monthly') {
    url.searchParams.set('Normalization', 'false')
  }

  return url.toString()
}

function snapshotWindow(granularity: Granularity) {
  if (granularity === 'monthly') {
    return { start: '2018-01-01', end: '2026-06-19' }
  }

  return { start: '2026-04-18', end: '2026-06-19' }
}

function validateRows(payload: unknown) {
  if (!Array.isArray(payload)) {
    return []
  }

  return payload.filter((row): row is NuukaEnergyRow => {
    if (typeof row !== 'object' || row === null) return false
    const candidate = row as Record<string, unknown>
    return (
      typeof candidate.timestamp === 'string' &&
      typeof candidate.value === 'number' &&
      Number.isFinite(candidate.value) &&
      typeof candidate.unit === 'string'
    )
  })
}

function canonicalizeTimestamp(timestamp: string) {
  const match = timestamp.match(/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2}))?)?$/)
  if (!match) {
    return null
  }

  const [, year, month, day, hour = '00', minute = '00', second = '00'] = match
  return `${year}-${month}-${day}T${hour}:${minute}:${second}`
}

function normalizeUnit(definition: UtilityDefinition, sourceUnit: string) {
  return definition.sourceUnitAliases.some(
    (alias) => alias.toLocaleLowerCase() === sourceUnit.toLocaleLowerCase(),
  )
    ? definition.canonicalUnit
    : null
}

function normalizeRows(definition: UtilityDefinition, granularity: Granularity, rows: readonly NuukaEnergyRow[]) {
  const byTimestamp = new Map<string, NormalizedPoint>()
  const qualityNotices = new Set<string>()

  for (const row of rows) {
    const timestamp = canonicalizeTimestamp(row.timestamp)
    const unit = normalizeUnit(definition, row.unit)

    if (!timestamp || !unit) {
      qualityNotices.add(!unit ? 'UNEXPECTED_UNIT' : 'INVALID_ROWS_DROPPED')
      continue
    }

    if (unit !== row.unit) {
      qualityNotices.add('UNIT_ALIAS_NORMALIZED')
    }

    if (row.value < 0) {
      qualityNotices.add('NEGATIVE_VALUE_PRESENT')
    }

    if (byTimestamp.has(timestamp)) {
      qualityNotices.add('DUPLICATES_RESOLVED')
    }

    byTimestamp.set(timestamp, {
      timestamp,
      sourceTimestamp: row.timestamp,
      value: row.value,
    })
  }

  const points = [...byTimestamp.values()].sort((left, right) =>
    left.timestamp.localeCompare(right.timestamp),
  )

  return {
    utility: definition.id,
    reportingGroup: definition.reportingGroup,
    displayName: definition.displayName,
    granularity,
    unit: definition.canonicalUnit,
    points,
    latestReading: points.at(-1) ?? null,
    qualityNotices: [...qualityNotices],
  }
}

async function fetchJson(endpoint: string) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15_000)

  try {
    const response = await fetch(endpoint, { signal: controller.signal })
    if (!response.ok) {
      return null
    }

    return (await response.json()) as unknown
  } finally {
    clearTimeout(timeout)
  }
}

async function fetchSnapshot(definition: UtilityDefinition, granularity: Granularity) {
  const window = snapshotWindow(granularity)
  const endpoint = buildNuukaEnergyUrl(definition, granularity, window.start, window.end)
  const payload = await fetchJson(endpoint)
  const rows = validateRows(payload)

  if (rows.length === 0) {
    return null
  }

  const normalized = normalizeRows(definition, granularity, rows)
  if (normalized.points.length === 0) {
    return null
  }

  const file = `${definition.id}-${granularity}.json`
  const generatedAt = new Date().toISOString()

  await writeFile(
    new URL(file, SNAPSHOT_DIR),
    `${JSON.stringify(
      {
        source: {
          endpoint,
          generatedAt,
          propertyCode: OODI.propertyCode,
          utility: definition.id,
          granularity,
        },
        series: normalized,
      },
      null,
      2,
    )}\n`,
    'utf8',
  )

  return {
    id: `${definition.id}-${granularity}`,
    utility: definition.id,
    granularity,
    propertyCode: OODI.propertyCode,
    generatedAt,
    sourceLatestTimestamp: normalized.latestReading?.timestamp ?? null,
    unit: normalized.unit,
    file,
    pointCount: normalized.points.length,
  }
}

async function main() {
  await mkdir(SNAPSHOT_DIR, { recursive: true })
  const entries = []

  for (const definition of UTILITY_DEFINITIONS) {
    for (const granularity of GRANULARITIES) {
      const entry = await fetchSnapshot(definition, granularity)
      if (entry) {
        entries.push(entry)
      }
    }
  }

  await writeFile(
    new URL('manifest.json', SNAPSHOT_DIR),
    `${JSON.stringify({ generatedAt: new Date().toISOString(), entries }, null, 2)}\n`,
    'utf8',
  )

  console.log(`Generated ${entries.length} authentic Nuuka snapshot entries.`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
