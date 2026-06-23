import type {
  DataQualityNotice,
  FallbackReason,
  Granularity,
  ProductPeriod,
  TimeWindow,
  UtilityDataError,
  UtilityId,
  UtilitySeriesResult,
  UtilityUnit,
} from '../utilities/utilitySeries'
import { oodiConfig } from '../../config/oodi'
import { getUtilityDefinition } from '../utilities/utilityDefinitions'
import { getPeriodDefinition, selectLatestPoints } from '../utilities/utilityPeriods'

export interface NuukaSnapshotManifestEntry {
  id: string
  utility: UtilityId
  granularity: Granularity
  propertyCode: string
  generatedAt: string
  sourceLatestTimestamp: string | null
  unit: UtilityUnit
  file: string
  pointCount: number
  checksum?: string
}

export interface NuukaSnapshotManifest {
  generatedAt: string
  entries: NuukaSnapshotManifestEntry[]
}

interface SnapshotPoint {
  timestamp: string
  sourceTimestamp: string
  value: number
}

interface SnapshotFile {
  source: {
    endpoint: string
    generatedAt: string
    propertyCode: string
    utility: UtilityId
    granularity: Granularity
  }
  series: {
    utility: UtilityId
    reportingGroup: string
    displayName: string
    granularity: Granularity
    unit: UtilityUnit
    points: SnapshotPoint[]
    latestReading: SnapshotPoint | null
    qualityNotices?: string[]
  }
}

export interface LoadNuukaSnapshotSeriesRequest {
  utility: UtilityId
  period: ProductPeriod
  granularity: Granularity
  requestedWindow: TimeWindow
  retrievedAt: string
  fallbackReason: Exclude<FallbackReason, null>
  fetcher?: typeof fetch
}

export function canUseSnapshotForError(error: UtilityDataError) {
  if (error.code === 'NETWORK' || error.code === 'TIMEOUT') {
    return true
  }

  if (error.code === 'HTTP') {
    return error.retryable
  }

  return (
    error.code === 'INVALID_JSON' ||
    error.code === 'INVALID_SCHEMA' ||
    error.code === 'UNEXPECTED_UNIT'
  )
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function validateSnapshotManifest(value: unknown):
  | { ok: true; manifest: NuukaSnapshotManifest }
  | { ok: false; message: string } {
  if (!isRecord(value) || typeof value.generatedAt !== 'string' || !Array.isArray(value.entries)) {
    return { ok: false, message: 'Invalid Nuuka snapshot manifest.' }
  }

  for (const entry of value.entries) {
    if (
      !isRecord(entry) ||
      typeof entry.id !== 'string' ||
      typeof entry.utility !== 'string' ||
      typeof entry.granularity !== 'string' ||
      typeof entry.propertyCode !== 'string' ||
      typeof entry.generatedAt !== 'string' ||
      typeof entry.file !== 'string' ||
      typeof entry.pointCount !== 'number'
    ) {
      return { ok: false, message: 'Invalid Nuuka snapshot manifest entry.' }
    }
  }

  return { ok: true, manifest: value as unknown as NuukaSnapshotManifest }
}

function isSnapshotPoint(value: unknown): value is SnapshotPoint {
  if (!isRecord(value)) return false

  return (
    typeof value.timestamp === 'string' &&
    typeof value.sourceTimestamp === 'string' &&
    typeof value.value === 'number' &&
    Number.isFinite(value.value)
  )
}

function validateSnapshotFile(value: unknown):
  | { ok: true; snapshot: SnapshotFile }
  | { ok: false; message: string } {
  if (!isRecord(value) || !isRecord(value.source) || !isRecord(value.series)) {
    return { ok: false, message: 'Invalid Nuuka snapshot file.' }
  }

  if (
    typeof value.source.endpoint !== 'string' ||
    typeof value.source.generatedAt !== 'string' ||
    typeof value.source.propertyCode !== 'string' ||
    typeof value.source.utility !== 'string' ||
    typeof value.source.granularity !== 'string' ||
    typeof value.series.utility !== 'string' ||
    typeof value.series.granularity !== 'string' ||
    typeof value.series.unit !== 'string' ||
    !Array.isArray(value.series.points) ||
    !value.series.points.every(isSnapshotPoint)
  ) {
    return { ok: false, message: 'Invalid Nuuka snapshot file fields.' }
  }

  return { ok: true, snapshot: value as unknown as SnapshotFile }
}

function noticesFromSnapshot(codes: readonly string[] | undefined): DataQualityNotice[] {
  const notices: DataQualityNotice[] = [
    {
      code: 'SNAPSHOT_USED',
      message: 'Using an authentic cached public Nuuka data snapshot after a technical API failure.',
    },
  ]

  for (const code of codes ?? []) {
    if (code === 'NEGATIVE_VALUE_PRESENT') {
      notices.push({
        code,
        message: 'Finite negative value preserved from the Nuuka source payload.',
      })
    }
  }

  return notices
}

export async function loadNuukaSnapshotSeries({
  utility,
  period,
  granularity,
  requestedWindow,
  retrievedAt,
  fallbackReason,
  fetcher = fetch,
}: LoadNuukaSnapshotSeriesRequest): Promise<UtilitySeriesResult | null> {
  const manifestResponse = await fetcher(`${import.meta.env.BASE_URL}data/nuuka/snapshots/manifest.json`)
  if (!manifestResponse.ok) {
    return null
  }

  const manifestValidation = validateSnapshotManifest(await manifestResponse.json())
  if (!manifestValidation.ok) {
    return null
  }

  const entry = manifestValidation.manifest.entries.find(
    (candidate) =>
      candidate.utility === utility &&
      candidate.granularity === granularity &&
      candidate.propertyCode === oodiConfig.nuuka.propertyCode,
  )
  if (!entry) {
    return null
  }

  const snapshotResponse = await fetcher(`${import.meta.env.BASE_URL}data/nuuka/snapshots/${entry.file}`)
  if (!snapshotResponse.ok) {
    return null
  }

  const snapshotValidation = validateSnapshotFile(await snapshotResponse.json())
  if (!snapshotValidation.ok) {
    return null
  }

  const snapshot = snapshotValidation.snapshot
  if (
    snapshot.source.propertyCode !== oodiConfig.nuuka.propertyCode ||
    snapshot.source.utility !== utility ||
    snapshot.source.granularity !== granularity ||
    snapshot.series.utility !== utility ||
    snapshot.series.granularity !== granularity
  ) {
    return null
  }

  const definition = getUtilityDefinition(utility)
  const periodDefinition = getPeriodDefinition(period)
  const sortedPoints = [...snapshot.series.points].sort((left, right) =>
    left.timestamp.localeCompare(right.timestamp),
  )
  const points = selectLatestPoints(sortedPoints, periodDefinition.intendedRecordCount)
  if (points.length === 0) {
    return null
  }

  return {
    status: 'success',
    series: {
      utility,
      reportingGroup: definition.reportingGroup,
      displayName: definition.displayName,
      unit: definition.canonicalUnit,
      points,
      latestReading: points.at(-1) ?? null,
      period: {
        requestedPeriod: period,
        requestedGranularity: granularity,
        requestedWindow,
        effectiveGranularity: granularity,
        effectiveWindow: {
          start: points[0].timestamp,
          end: points.at(-1)?.timestamp ?? points[0].timestamp,
        },
        isFallback: true,
        fallbackReason,
        intendedRecordCount: periodDefinition.intendedRecordCount,
        actualRecordCount: points.length,
      },
      provenance: {
        classification: 'real-public-building-data',
        provider: 'Nuuka',
        dataset: 'Helsinki public building energy data',
        endpoint: snapshot.source.endpoint,
        retrievedAt,
        origin: 'snapshot',
        snapshotGeneratedAt: snapshot.source.generatedAt,
      },
      qualityNotices: noticesFromSnapshot(snapshot.series.qualityNotices),
    },
  }
}
