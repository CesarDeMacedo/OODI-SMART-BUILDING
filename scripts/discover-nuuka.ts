import { mkdir, writeFile } from 'node:fs/promises'
import {
  GRANULARITIES,
  OODI_LOCATION_NAME,
  OODI_SEARCH_TERMS,
  PROPERTY_LIST_ENDPOINT,
  REPORTING_GROUPS,
  SWAGGER_ENDPOINT,
  asJsonValue,
  fetchEnergyData,
  fetchPropertyList,
  fetchPropertySearch,
  findPropertyMatches,
  getRecentDateWindow,
  summarizeEnergyResult,
  uniqueByStableJson,
  type EnergyAvailabilityResult,
  type Granularity,
  type NuukaPropertyDetail,
  type NuukaPropertyListItem,
  type ReportingGroup,
} from '../src/nuuka.ts'

const DATA_DIR = new URL('../data/', import.meta.url)
const MATCHES_FILE = new URL('../data/nuuka-properties-matches.json', import.meta.url)
const REPORT_FILE = new URL('../data/nuuka-discovery-report.md', import.meta.url)
const HISTORICAL_START = '2018-01-01'

function markdownTable(rows: EnergyAvailabilityResult[]) {
  const header = [
    'Reporting Group',
    'Available',
    'Endpoint',
    'Granularity',
    'Unit',
    'Oldest Returned Timestamp',
    'Latest Returned Timestamp',
    'Number of Records',
    'Errors or Notes',
  ]
  const escapeCell = (value: unknown) =>
    String(value).replace(/\|/g, '\\|').replace(/\r?\n/g, ' ')

  return [
    `| ${header.join(' | ')} |`,
    `| ${header.map(() => '---').join(' | ')} |`,
    ...rows.map((row) =>
      [
        row.reportingGroup,
        row.available ? 'Yes' : 'No',
        row.endpoint,
        row.granularity,
        row.unit,
        row.oldestReturnedTimestamp,
        row.latestReturnedTimestamp,
        row.numberOfRecords,
        row.errorsOrNotes,
      ]
        .map(escapeCell)
        .join(' | '),
    ).map((line) => `| ${line} |`),
  ].join('\n')
}

function firstDetail(details: NuukaPropertyDetail[]) {
  return details.find((detail) => detail.locationName === OODI_LOCATION_NAME) ?? details[0] ?? null
}

function latestTimestamp(summary: EnergyAvailabilityResult) {
  return summary.latestReturnedTimestamp === 'n/a'
    ? null
    : new Date(summary.latestReturnedTimestamp)
}

function fallbackWindowAround(timestamp: Date) {
  const end = new Date(timestamp)
  end.setUTCDate(end.getUTCDate() + 1)
  const start = new Date(end)
  start.setUTCDate(start.getUTCDate() - 30)

  return {
    startTime: start.toISOString().slice(0, 10),
    endTime: end.toISOString().slice(0, 10),
  }
}

async function discoverEnergyAvailability(
  reportingGroup: ReportingGroup,
  granularity: Granularity,
  startTime: string,
  endTime: string,
) {
  const recentResult = await fetchEnergyData(reportingGroup, granularity, startTime, endTime)
  const recentSummary = summarizeEnergyResult(reportingGroup, granularity, recentResult)

  if (recentSummary.available) {
    return recentSummary
  }

  const historicalResult = await fetchEnergyData(
    reportingGroup,
    'Monthly',
    HISTORICAL_START,
    endTime,
  )
  const historicalSummary = summarizeEnergyResult(
    reportingGroup,
    'Monthly',
    historicalResult,
    `Recent ${granularity} window had no records; monthly historical fallback used.`,
  )

  const latestHistorical = latestTimestamp(historicalSummary)
  if (granularity !== 'Monthly' && latestHistorical) {
    const fallbackWindow = fallbackWindowAround(latestHistorical)
    const sameGranularityResult = await fetchEnergyData(
      reportingGroup,
      granularity,
      fallbackWindow.startTime,
      fallbackWindow.endTime,
    )
    const sameGranularitySummary = summarizeEnergyResult(
      reportingGroup,
      granularity,
      sameGranularityResult,
      `Recent ${granularity} window had no records; same-granularity fallback used around latest monthly timestamp ${historicalSummary.latestReturnedTimestamp}.`,
    )

    return {
      ...sameGranularitySummary,
      endpoint: `${recentSummary.endpoint} | monthly probe: ${historicalSummary.endpoint} | fallback: ${sameGranularitySummary.endpoint}`,
      errorsOrNotes: sameGranularitySummary.available
        ? sameGranularitySummary.errorsOrNotes
        : `${sameGranularitySummary.errorsOrNotes} Monthly historical data is available from ${historicalSummary.oldestReturnedTimestamp} to ${historicalSummary.latestReturnedTimestamp}.`,
    }
  }

  return {
    ...historicalSummary,
    granularity,
    endpoint: `${recentSummary.endpoint} | fallback: ${historicalSummary.endpoint}`,
  }
}

function buildReport(args: {
  testedAt: string
  propertyStatus: number
  totalProperties: number
  matches: NuukaPropertyListItem[]
  details: NuukaPropertyDetail[]
  selectedDetail: NuukaPropertyDetail | null
  availability: EnergyAvailabilityResult[]
  recentStart: string
  recentEnd: string
}) {
  const {
    testedAt,
    propertyStatus,
    totalProperties,
    matches,
    details,
    selectedDetail,
    availability,
    recentStart,
    recentEnd,
  } = args
  const buildings = selectedDetail?.buildings ?? []
  const reportingGroups = selectedDetail?.reportingGroups ?? []

  return `# Nuuka Discovery Report

Generated at: ${testedAt}

## Source Endpoints

- Property list: ${PROPERTY_LIST_ENDPOINT}
- Property search: ${new URL('/api/v1.0/Property/Search', 'https://helsinki-openapi.nuuka.cloud').toString()}
- Energy data: ${new URL('/api/v1.0/EnergyData/{Hourly|Daily|Monthly}/ListByProperty', 'https://helsinki-openapi.nuuka.cloud').toString()}
- Swagger: ${SWAGGER_ENDPOINT}

## Property Discovery

- HTTP status: ${propertyStatus}
- Total properties returned: ${totalProperties}
- Search terms: ${OODI_SEARCH_TERMS.map((term) => `\`${term}\``).join(', ')}
- Possible Oodi matches: ${matches.length}
- Oodi found: ${selectedDetail ? 'Yes' : 'No'}
- Exact returned name: ${selectedDetail?.locationName ?? 'n/a'}
- Property name: ${selectedDetail?.propertyName ?? 'n/a'}
- Property code: ${selectedDetail?.propertyCode ?? 'n/a'}
- Purpose of use: ${selectedDetail?.purposeOfUse ?? 'n/a'}
- Building type: ${selectedDetail?.buildingType ?? 'n/a'}
- Year of introduction: ${selectedDetail?.yearOfIntroduction ?? 'n/a'}
- Total area: ${selectedDetail?.totalArea ?? 'n/a'}
- Heated area: ${selectedDetail?.heatedArea ?? 'n/a'}
- Volume: ${selectedDetail?.volume ?? 'n/a'}
- Latitude: ${selectedDetail?.latitude ?? 'n/a'}
- Longitude: ${selectedDetail?.longitude ?? 'n/a'}

## Reporting Groups Listed On Property

\`\`\`json
${JSON.stringify(reportingGroups, null, 2)}
\`\`\`

Note: the Nuuka API uses \`DistrictCooling\` as the official reporting group. This corresponds to the conceptual "Cooling" group for this project.

## Associated Buildings

\`\`\`json
${JSON.stringify(buildings, null, 2)}
\`\`\`

## Complete Property List Matches

\`\`\`json
${JSON.stringify(matches, null, 2)}
\`\`\`

## Complete Detailed Property Search Results

\`\`\`json
${JSON.stringify(details, null, 2)}
\`\`\`

## Energy Availability

Recent test window: ${recentStart} to ${recentEnd}. If a recent query returned no records, the script tested monthly historical data from ${HISTORICAL_START} to ${recentEnd}. For hourly and daily rows, the script then tested the same granularity around the latest monthly timestamp when one was available.

${markdownTable(availability)}

## CORS

A command-line preflight/header inspection on 2026-06-19 returned \`Access-Control-Allow-Origin: *\`. The temporary React page in \`src/App.tsx\` performs the browser-side validation directly and displays any CORS or network error clearly.

## Error Handling

The discovery script uses request timeouts, logs every endpoint, validates JSON parsing, handles empty response bodies, records API 404 payloads as notes, and does not use secrets or API keys.
`
}

async function main() {
  const testedAt = new Date().toISOString()
  const { startTime, endTime } = getRecentDateWindow(30)

  await mkdir(DATA_DIR, { recursive: true })

  const propertyListResult = await fetchPropertyList()
  const properties = Array.isArray(propertyListResult.data) ? propertyListResult.data : []
  const matches = uniqueByStableJson(findPropertyMatches(properties))

  console.log('Property matches:')
  console.log(JSON.stringify(matches, null, 2))

  const detailResults = await Promise.all(
    OODI_SEARCH_TERMS.map((term) => fetchPropertySearch(term)),
  )
  const details = uniqueByStableJson(
    detailResults.flatMap((result) => (Array.isArray(result.data) ? result.data : [])),
  )
  const selectedDetail = firstDetail(details)

  const availability: EnergyAvailabilityResult[] = []
  for (const reportingGroup of REPORTING_GROUPS) {
    for (const granularity of GRANULARITIES) {
      availability.push(
        await discoverEnergyAvailability(reportingGroup, granularity, startTime, endTime),
      )
    }
  }

  const matchesPayload = {
    generatedAt: testedAt,
    endpoint: PROPERTY_LIST_ENDPOINT,
    status: propertyListResult.status,
    totalProperties: properties.length,
    terms: OODI_SEARCH_TERMS,
    matches: asJsonValue(matches),
    detailedMatches: asJsonValue(details),
  }

  await writeFile(MATCHES_FILE, `${JSON.stringify(matchesPayload, null, 2)}\n`, 'utf8')
  await writeFile(
    REPORT_FILE,
    buildReport({
      testedAt,
      propertyStatus: propertyListResult.status,
      totalProperties: properties.length,
      matches,
      details,
      selectedDetail,
      availability,
      recentStart: startTime,
      recentEnd: endTime,
    }),
    'utf8',
  )

  console.log(`Wrote ${MATCHES_FILE.pathname}`)
  console.log(`Wrote ${REPORT_FILE.pathname}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
