export type UtilityId = 'electricity' | 'heat' | 'water' | 'districtCooling'

export type NuukaReportingGroup =
  | 'Electricity'
  | 'Heat'
  | 'Water'
  | 'DistrictCooling'

export type Granularity = 'hourly' | 'daily' | 'monthly'

export type ProductPeriod = '24h' | '30d' | '12m'

export type UtilityUnit = 'kWh' | 'm3'

export type FallbackReason =
  | 'requested-window-empty'
  | 'requested-window-partial'
  | 'network-unavailable-snapshot-used'
  | 'api-error-snapshot-used'
  | null

export type SeriesOrigin = 'network' | 'memory-cache' | 'snapshot'

export type DataClassification = 'real-public-building-data'

export interface UtilityDefinition {
  id: UtilityId
  reportingGroup: NuukaReportingGroup
  displayName: string
  canonicalUnit: UtilityUnit
  sourceUnitAliases: readonly string[]
}

export interface UtilityDataPoint {
  timestamp: string
  sourceTimestamp: string
  value: number
}

export interface TimeWindow {
  start: string
  end: string
}

export interface PeriodResolution {
  requestedPeriod: ProductPeriod
  requestedGranularity: Granularity
  requestedWindow: TimeWindow
  effectiveGranularity: Granularity
  effectiveWindow: TimeWindow | null
  isFallback: boolean
  fallbackReason: FallbackReason
  intendedRecordCount: number
  actualRecordCount: number
}

export interface UtilityProvenance {
  classification: DataClassification
  provider: 'Nuuka'
  dataset: 'Helsinki public building energy data'
  endpoint: string | null
  retrievedAt: string
  origin: SeriesOrigin
  snapshotGeneratedAt?: string
}

export type DataQualityNoticeCode =
  | 'EMPTY_REQUESTED_WINDOW'
  | 'FALLBACK_WINDOW_USED'
  | 'SNAPSHOT_USED'
  | 'INVALID_ROWS_DROPPED'
  | 'DUPLICATES_RESOLVED'
  | 'UNIT_ALIAS_NORMALIZED'
  | 'UNEXPECTED_UNIT'
  | 'PARTIAL_WINDOW'
  | 'DELAYED_SOURCE_DATA'
  | 'NON_HOURLY_TIMESTAMP'
  | 'SOURCE_SCHEMA_VARIATION'
  | 'NEGATIVE_VALUE_PRESENT'

export interface DataQualityNotice {
  code: DataQualityNoticeCode
  message: string
  count?: number
}

export interface UtilitySeries {
  utility: UtilityId
  reportingGroup: NuukaReportingGroup
  displayName: string
  unit: UtilityUnit
  points: UtilityDataPoint[]
  latestReading: UtilityDataPoint | null
  period: PeriodResolution
  provenance: UtilityProvenance
  qualityNotices: DataQualityNotice[]
}

export type UtilityDataErrorCode =
  | 'ABORTED'
  | 'TIMEOUT'
  | 'NETWORK'
  | 'HTTP'
  | 'INVALID_JSON'
  | 'INVALID_SCHEMA'
  | 'UNEXPECTED_UNIT'
  | 'NO_DATA_AVAILABLE'
  | 'SNAPSHOT_INVALID'
  | 'UNKNOWN'

export interface UtilityDataError {
  code: UtilityDataErrorCode
  message: string
  retryable: boolean
  statusCode?: number
  cause?: unknown
}

export type UtilitySeriesResult =
  | { status: 'success'; series: UtilitySeries }
  | { status: 'empty'; series: UtilitySeries; message: string }
  | { status: 'error'; error: UtilityDataError; previousSeries?: UtilitySeries }

export interface UtilitySeriesRequest {
  utility: UtilityId
  period: ProductPeriod
  end?: Date
  refresh?: 'default' | 'force'
  signal?: AbortSignal
}

export interface UtilityRepository {
  getSeries(request: UtilitySeriesRequest): Promise<UtilitySeriesResult>
  invalidate(request?: Partial<Pick<UtilitySeriesRequest, 'utility' | 'period'>>): void
}
