import type { UtilityDefinition, UtilitySeriesResult } from '../../data/utilities/utilitySeries'
import { DataStatus } from '../layout/DataStatus'
import { formatMetricValue } from '../../features/resourcePerformance/metrics'

function getSeries(result: UtilitySeriesResult | null) {
  if (!result) return undefined
  return result.status === 'error' ? result.previousSeries : result.series
}

export function UtilitySummaryCard({
  definition,
  loading,
  result,
  selected = false,
}: {
  definition: UtilityDefinition
  loading: boolean
  result: UtilitySeriesResult | null
  selected?: boolean
}) {
  const series = getSeries(result)
  const latest = series?.latestReading
  const status =
    loading ? { status: 'loading' as const } :
    result?.status === 'error' ? { status: 'error' as const, message: result.error.message, retryable: result.error.retryable } :
    result?.status === 'empty' ? { status: 'empty' as const, message: result.message } :
    series?.provenance.origin === 'snapshot' ? { status: 'cached-public-snapshot' as const, message: 'Cached Public Data Snapshot' } :
    series?.provenance.origin === 'memory-cache' ? { status: 'memory-cache' as const, message: 'Memory cache' } :
    series?.period.isFallback ? { status: 'partial' as const, data: series, message: 'Latest available period' } :
    { status: 'success' as const, data: series }

  return (
    <article
      className={`utility-card utility-card--${definition.id} ${selected ? 'utility-card--selected' : ''}`}
      data-selected={selected ? 'true' : 'false'}
      data-utility={definition.id}
    >
      <div className="utility-card__header">
        <h3>{definition.displayName}</h3>
        <span>{series?.period.requestedGranularity ?? 'Hourly'}</span>
      </div>
      <strong>{formatMetricValue(latest?.value, definition.canonicalUnit)}</strong>
      <p>Latest source timestamp: {latest?.sourceTimestamp ?? 'n/a'}</p>
      <p>Source: Nuuka Open API</p>
      <DataStatus state={status} />
    </article>
  )
}
