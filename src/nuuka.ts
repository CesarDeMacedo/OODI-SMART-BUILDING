export const NUUKA_BASE_URL = 'https://helsinki-openapi.nuuka.cloud/api/v1.0'
export const PROPERTY_LIST_ENDPOINT = `${NUUKA_BASE_URL}/Property/List?Customer=Helsinki`
export const PROPERTY_SEARCH_ENDPOINT = `${NUUKA_BASE_URL}/Property/Search`
export const SWAGGER_ENDPOINT =
  'https://helsinki-openapi.nuuka.cloud/swagger/Nuuka%20Open%20API/swagger.json'

export const OODI_SEARCH_TERMS = [
  'Oodi',
  'Keskustakirjasto',
  'Helsingin keskustakirjasto',
  'T\u00f6\u00f6l\u00f6nlahdenkatu 4',
  'Toolonlahdenkatu 4',
]

export const OODI_LOCATION_NAME = '4669 Oodi Helsingin keskustakirjasto'

export const REPORTING_GROUPS = [
  'Electricity',
  'Heat',
  'Water',
  'DistrictCooling',
] as const

export const GRANULARITIES = ['Hourly', 'Daily', 'Monthly'] as const

export type ReportingGroup = (typeof REPORTING_GROUPS)[number]
export type Granularity = (typeof GRANULARITIES)[number]

export type NuukaPropertyListItem = {
  locationName?: string | null
  propertyName?: string | null
  propertyCode?: string | null
  [key: string]: unknown
}

export type NuukaReportingGroup = {
  name?: string | null
  energyType?: string | null
  isTopGroup?: boolean | null
}

export type NuukaBuilding = NuukaPropertyListItem & {
  buildingCode?: string | null
  yearOfIntroduction?: string | null
  purposeOfUse?: string | null
  totalArea?: number | null
  heatedArea?: number | null
  volume?: number | null
  buildingType?: string | null
  longitude?: string | null
  latitude?: string | null
  reportingGroups?: NuukaReportingGroup[] | null
}

export type NuukaPropertyDetail = NuukaPropertyListItem & {
  yearOfIntroduction?: string | null
  purposeOfUse?: string | null
  totalArea?: number | null
  heatedArea?: number | null
  volume?: number | null
  buildingType?: string | null
  latitude?: string | null
  longitude?: string | null
  reportingGroups?: NuukaReportingGroup[] | null
  buildings?: NuukaBuilding[] | null
}

export type NuukaEnergyRecord = {
  timestamp: string
  reportingGroup?: string | null
  locationName?: string | null
  value?: number | null
  unit?: string | null
}

export type NuukaError = {
  errorNote?: string
  errorCode?: string
}

export type FetchJsonResult<T> = {
  endpoint: string
  ok: boolean
  status: number
  statusText: string
  data: T | null
  error: string | null
  rawPreview: string
}

export type EnergyAvailabilityResult = {
  reportingGroup: ReportingGroup
  granularity: Granularity
  available: boolean
  endpoint: string
  unit: string
  oldestReturnedTimestamp: string
  latestReturnedTimestamp: string
  numberOfRecords: number
  errorsOrNotes: string
}

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue }

export function normalizeText(value: unknown) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

export function collectTextFields(value: unknown): string[] {
  if (typeof value === 'string') {
    return [value]
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => collectTextFields(item))
  }

  if (value && typeof value === 'object') {
    return Object.values(value).flatMap((item) => collectTextFields(item))
  }

  return []
}

export function findPropertyMatches(
  properties: NuukaPropertyListItem[],
  terms = OODI_SEARCH_TERMS,
) {
  const normalizedTerms = terms.map(normalizeText)

  return properties.filter((property) => {
    const text = normalizeText(collectTextFields(property).join(' '))
    return normalizedTerms.some((term) => text.includes(term))
  })
}

export function uniqueByStableJson<T>(items: T[]) {
  const seen = new Set<string>()
  return items.filter((item) => {
    const key = JSON.stringify(item)
    if (seen.has(key)) {
      return false
    }

    seen.add(key)
    return true
  })
}

export async function fetchJsonWithTimeout<T>(
  endpoint: string,
  timeoutMs = 20_000,
): Promise<FetchJsonResult<T>> {
  console.log(`Nuuka request: ${endpoint}`)

  try {
    const response = await fetch(endpoint, {
      signal: AbortSignal.timeout(timeoutMs),
    })
    const raw = await response.text()
    const rawPreview = raw.slice(0, 2_000)

    if (!raw.trim()) {
      return {
        endpoint,
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        data: null,
        error: response.ok ? 'Empty response body.' : `HTTP ${response.status}: empty response body.`,
        rawPreview,
      }
    }

    try {
      return {
        endpoint,
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        data: JSON.parse(raw) as T,
        error: response.ok ? null : `HTTP ${response.status}: ${rawPreview}`,
        rawPreview,
      }
    } catch (error) {
      return {
        endpoint,
        ok: false,
        status: response.status,
        statusText: response.statusText,
        data: null,
        error: `Invalid JSON response: ${error instanceof Error ? error.message : String(error)}`,
        rawPreview,
      }
    }
  } catch (error) {
    return {
      endpoint,
      ok: false,
      status: 0,
      statusText: 'Network error',
      data: null,
      error: error instanceof Error ? error.message : String(error),
      rawPreview: '',
    }
  }
}

export async function fetchPropertyList() {
  return fetchJsonWithTimeout<NuukaPropertyListItem[]>(PROPERTY_LIST_ENDPOINT)
}

export async function fetchPropertySearch(
  searchString: string,
  searchFromRecord = 'LocationName',
) {
  const params = new URLSearchParams({
    SearchString: searchString,
    SearchFromRecord: searchFromRecord,
  })

  return fetchJsonWithTimeout<NuukaPropertyDetail[]>(
    `${PROPERTY_SEARCH_ENDPOINT}?${params}`,
  )
}

export function buildEnergyEndpoint(
  reportingGroup: ReportingGroup,
  granularity: Granularity,
  startTime: string,
  endTime: string,
  searchString = OODI_LOCATION_NAME,
) {
  const params = new URLSearchParams({
    Record: 'LocationName',
    SearchString: searchString,
    ReportingGroup: reportingGroup,
    StartTime: startTime,
    EndTime: endTime,
  })

  if (granularity === 'Monthly') {
    params.set('Normalization', 'false')
  }

  return `${NUUKA_BASE_URL}/EnergyData/${granularity}/ListByProperty?${params}`
}

export async function fetchEnergyData(
  reportingGroup: ReportingGroup,
  granularity: Granularity,
  startTime: string,
  endTime: string,
  searchString = OODI_LOCATION_NAME,
) {
  return fetchJsonWithTimeout<NuukaEnergyRecord[] | NuukaError>(
    buildEnergyEndpoint(reportingGroup, granularity, startTime, endTime, searchString),
    30_000,
  )
}

export function summarizeEnergyResult(
  reportingGroup: ReportingGroup,
  granularity: Granularity,
  result: FetchJsonResult<NuukaEnergyRecord[] | NuukaError>,
  notePrefix = '',
): EnergyAvailabilityResult {
  const records = Array.isArray(result.data) ? result.data : []
  const timestamps = records
    .map((record) => record.timestamp)
    .filter(Boolean)
    .sort()
  const units = [...new Set(records.map((record) => record.unit).filter(Boolean))]
  const apiError = !Array.isArray(result.data) && result.data ? JSON.stringify(result.data) : ''
  const notes = [notePrefix, result.error, apiError].filter(Boolean).join(' ')

  return {
    reportingGroup,
    granularity,
    available: records.length > 0,
    endpoint: result.endpoint,
    unit: units.join(', ') || 'n/a',
    oldestReturnedTimestamp: timestamps[0] ?? 'n/a',
    latestReturnedTimestamp: timestamps.at(-1) ?? 'n/a',
    numberOfRecords: records.length,
    errorsOrNotes: notes || 'OK',
  }
}

export function toDateOnly(date: Date) {
  return date.toISOString().slice(0, 10)
}

export function getRecentDateWindow(days = 30, now = new Date()) {
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  const start = new Date(end)
  start.setUTCDate(start.getUTCDate() - days)

  return {
    startTime: toDateOnly(start),
    endTime: toDateOnly(end),
  }
}

export function asJsonValue(value: unknown): JsonValue {
  return JSON.parse(JSON.stringify(value)) as JsonValue
}
