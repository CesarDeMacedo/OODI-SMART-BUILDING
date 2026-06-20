import { oodiConfig } from '../../config/oodi'
import { getUtilityDefinition } from '../utilities/utilityDefinitions'
import { getPeriodDefinition, selectLatestPoints } from '../utilities/utilityPeriods'
import { buildNuukaEnergyUrl } from './nuukaEndpoints'
import type {
  DataQualityNotice,
  FallbackReason,
  Granularity,
  ProductPeriod,
  TimeWindow,
  UtilityId,
  UtilitySeries,
  UtilitySeriesResult,
} from '../utilities/utilitySeries'
import { validateNuukaEnergyPayload } from './nuukaValidation'
import { normalizeNuukaRows } from './normalizeNuukaSeries'
import type { NuukaEnergyRow } from './nuukaTypes'

type FetchPayloadRequest = {
  utility: UtilityId
  granularity: Granularity
  start: string
  end: string
  endpoint: string
}

export interface ResolveNuukaSeriesRequest {
  utility: UtilityId
  period: ProductPeriod
  requestedWindow: TimeWindow
  fetchPayload: (request: FetchPayloadRequest) => Promise<unknown>
  retrievedAt: string
}

function addNotice(notices: DataQualityNotice[], notice: DataQualityNotice) {
  notices.push(notice)
}

function emptyRequestedWindowNotice(): DataQualityNotice {
  return {
    code: 'EMPTY_REQUESTED_WINDOW',
    message: 'No readings were returned for the requested Nuuka window.',
  }
}

function addDays(dateString: string, days: number) {
  const date = new Date(`${dateString}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

function fallbackWindowAround(anchorTimestamp: string) {
  const anchorDate = anchorTimestamp.slice(0, 10)
  const end = addDays(anchorDate, 1)
  return {
    start: addDays(end, -30),
    end,
  }
}

function effectiveWindow(points: { timestamp: string }[]): TimeWindow | null {
  if (points.length === 0) {
    return null
  }

  return {
    start: points[0].timestamp,
    end: points.at(-1)?.timestamp ?? points[0].timestamp,
  }
}

async function fetchRows(
  request: FetchPayloadRequest,
  fetchPayload: ResolveNuukaSeriesRequest['fetchPayload'],
) {
  const payload = await fetchPayload(request)
  const validation = validateNuukaEnergyPayload(payload)

  if (validation.kind !== 'rows') {
    return []
  }

  return validation.rows
}

function buildSeries(args: {
  utility: UtilityId
  period: ProductPeriod
  granularity: Granularity
  requestedWindow: TimeWindow
  rows: NuukaEnergyRow[]
  retrievedAt: string
  isFallback: boolean
  fallbackReason: FallbackReason
  fallbackNotice?: string
  endpoint: string | null
  extraNotices?: DataQualityNotice[]
}): UtilitySeries {
  const definition = getUtilityDefinition(args.utility)
  const periodDefinition = getPeriodDefinition(args.period)
  const normalized = normalizeNuukaRows({
    utility: args.utility,
    granularity: args.granularity,
    rows: args.rows,
  })
  const points = selectLatestPoints(normalized.points, periodDefinition.intendedRecordCount)
  const qualityNotices = [...normalized.qualityNotices, ...(args.extraNotices ?? [])]

  if (args.isFallback) {
    addNotice(qualityNotices, {
      code: 'FALLBACK_WINDOW_USED',
      message: args.fallbackNotice ?? 'The requested Nuuka window was empty; an earlier same-granularity window was used.',
    })
  }

  if (points.length < periodDefinition.intendedRecordCount && points.length > 0) {
    addNotice(qualityNotices, {
      code: 'PARTIAL_WINDOW',
      message: 'Fewer readings were available than the selected period normally contains.',
      count: points.length,
    })
  }

  return {
    utility: args.utility,
    reportingGroup: definition.reportingGroup,
    displayName: definition.displayName,
    unit: normalized.unit,
    points,
    latestReading: points.at(-1) ?? null,
    period: {
      requestedPeriod: args.period,
      requestedGranularity: periodDefinition.granularity,
      requestedWindow: args.requestedWindow,
      effectiveGranularity: args.granularity,
      effectiveWindow: effectiveWindow(points),
      isFallback: args.isFallback,
      fallbackReason: args.fallbackReason,
      intendedRecordCount: periodDefinition.intendedRecordCount,
      actualRecordCount: points.length,
    },
    provenance: {
      classification: 'real-public-building-data',
      provider: 'Nuuka',
      dataset: 'Helsinki public building energy data',
      endpoint: args.endpoint,
      retrievedAt: args.retrievedAt,
      origin: 'network',
    },
    qualityNotices,
  }
}

export async function resolveNuukaSeries(
  request: ResolveNuukaSeriesRequest,
): Promise<UtilitySeriesResult> {
  const periodDefinition = getPeriodDefinition(request.period)
  const definition = getUtilityDefinition(request.utility)
  const endpointFor = (granularity: Granularity, start: string, end: string) =>
    buildNuukaEnergyUrl({
      reportingGroup: definition.reportingGroup,
      granularity,
      start,
      end,
    })

  const initialEndpoint = endpointFor(
    periodDefinition.granularity,
    request.requestedWindow.start,
    request.requestedWindow.end,
  )
  const initialRows = await fetchRows(
    {
      utility: request.utility,
      granularity: periodDefinition.granularity,
      start: request.requestedWindow.start,
      end: request.requestedWindow.end,
      endpoint: initialEndpoint,
    },
    request.fetchPayload,
  )

  if (initialRows.length > 0) {
    const series = buildSeries({
      utility: request.utility,
      period: request.period,
      granularity: periodDefinition.granularity,
      requestedWindow: request.requestedWindow,
      rows: initialRows,
      retrievedAt: request.retrievedAt,
      isFallback: false,
      fallbackReason: null,
      endpoint: initialEndpoint,
    })

    return { status: 'success', series }
  }

  const monthlyEndpoint = endpointFor(
    'monthly',
    oodiConfig.nuuka.yearOfIntroduction.slice(0, 10),
    request.requestedWindow.end,
  )
  const monthlyRows = await fetchRows(
    {
      utility: request.utility,
      granularity: 'monthly',
      start: oodiConfig.nuuka.yearOfIntroduction.slice(0, 10),
      end: request.requestedWindow.end,
      endpoint: monthlyEndpoint,
    },
    request.fetchPayload,
  )
  const monthly = buildSeries({
    utility: request.utility,
    period: '12m',
    granularity: 'monthly',
    requestedWindow: {
      start: oodiConfig.nuuka.yearOfIntroduction.slice(0, 10),
      end: request.requestedWindow.end,
    },
    rows: monthlyRows,
    retrievedAt: request.retrievedAt,
    isFallback: false,
    fallbackReason: null,
    endpoint: monthlyEndpoint,
  })
  const anchor = monthly.latestReading?.timestamp

  if (!anchor) {
    const emptySeries = buildSeries({
      utility: request.utility,
      period: request.period,
      granularity: periodDefinition.granularity,
      requestedWindow: request.requestedWindow,
      rows: [],
      retrievedAt: request.retrievedAt,
      isFallback: false,
      fallbackReason: null,
      endpoint: initialEndpoint,
      extraNotices: [emptyRequestedWindowNotice()],
    })

    return {
      status: 'empty',
      series: emptySeries,
      message: 'No readings were returned for the requested dates.',
    }
  }

  const fallbackWindow = fallbackWindowAround(anchor)
  const fallbackEndpoint = endpointFor(
    periodDefinition.granularity,
    fallbackWindow.start,
    fallbackWindow.end,
  )
  const fallbackRows = await fetchRows(
    {
      utility: request.utility,
      granularity: periodDefinition.granularity,
      start: fallbackWindow.start,
      end: fallbackWindow.end,
      endpoint: fallbackEndpoint,
    },
    request.fetchPayload,
  )
  const fallbackSeries = buildSeries({
    utility: request.utility,
    period: request.period,
    granularity: periodDefinition.granularity,
    requestedWindow: request.requestedWindow,
    rows: fallbackRows,
    retrievedAt: request.retrievedAt,
    isFallback: fallbackRows.length > 0,
    fallbackReason: fallbackRows.length > 0 ? 'requested-window-empty' : null,
    fallbackNotice: `The requested window was empty; same-granularity fallback used around latest monthly timestamp ${anchor}.`,
    endpoint: fallbackRows.length > 0 ? fallbackEndpoint : initialEndpoint,
    extraNotices: [emptyRequestedWindowNotice()],
  })

  if (fallbackRows.length === 0) {
    return {
      status: 'empty',
      series: fallbackSeries,
      message: 'No same-granularity readings were available after fallback.',
    }
  }

  return { status: 'success', series: fallbackSeries }
}
