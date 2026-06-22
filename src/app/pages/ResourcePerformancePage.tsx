import { useState } from 'react'
import { utilityDefinitions } from '../../data/utilities/utilityDefinitions'
import type { ProductPeriod, UtilityDefinition, UtilityId, UtilitySeriesResult } from '../../data/utilities/utilitySeries'
import { useUtilitySeries, useUtilitySummaries } from '../useAppData'
import { MetricCard } from '../../components/cards/MetricCard'
import { DataStatus } from '../../components/layout/DataStatus'
import { DisclosureBar } from '../../components/layout/DisclosureBar'
import { MediaSlot } from '../../components/layout/MediaSlot'
import { mediaAssets } from '../../content/mediaAssets'
import { formatMetricValue, getChartPath, getSeriesMetrics } from '../../features/resourcePerformance/metrics'
import { getPeriodLabel, periodOptions, utilityOptions } from '../../features/resourcePerformance/resourcePerformanceState'

function getSeries(result: ReturnType<typeof useUtilitySeries>['result']) {
  if (!result) return undefined
  return result.status === 'error' ? result.previousSeries : result.series
}

export function ResourcePerformancePage() {
  const [utility, setUtility] = useState<UtilityId>('electricity')
  const [period, setPeriod] = useState<ProductPeriod>('24h')
  const selected = useUtilitySeries(utility, period)
  const summaries = useUtilitySummaries('24h')
  const series = getSeries(selected.result)
  const metrics = getSeriesMetrics(series)
  const selectedDefinition = utilityDefinitions.find((definition) => definition.id === utility)
  const sourceTimestamp = series?.latestReading?.sourceTimestamp ?? 'n/a'

  return (
    <main className="page page--resource" data-layout="resource-performance">
      <section className="resource-hero">
        <div className="resource-hero__intro">
          <span className="eyebrow">Resource Performance</span>
          <h1>Resource Performance</h1>
          <p>
            Monitor public Nuuka utility records by resource and period, with
            source timestamps and returned ranges kept visible.
          </p>
          <div className="segmented-control segmented-control--utilities" data-control="utility-selector" aria-label="Utility selection">
            {utilityOptions.map((option) => (
              <button
                aria-pressed={utility === option.id}
                data-utility={option.id}
                key={option.id}
                onClick={() => setUtility(option.id)}
                type="button"
              >
                {option.displayName}
              </button>
            ))}
          </div>
        </div>
        <div className="resource-hero__media-wrap" data-utility={utility}>
          <MediaSlot
            asset={mediaAssets.resourcePerformanceHeroMedia}
            className="resource-hero__media"
            overlay={mediaAssets.resourcePerformanceOverlayMedia}
            slotName="resourcePerformanceHeroMedia"
          />
          <ResourceOverlay utility={utility} />
        </div>
      </section>

      <section className="resource-layout">
        <article className="panel chart-panel" data-utility={utility}>
          <div className="section-heading">
            <div>
              <span className="eyebrow">Selected Utility</span>
              <h2>{selectedDefinition?.displayName ?? 'Utility'} Performance</h2>
            </div>
            <div className="segmented-control" data-control="period-selector" aria-label="Period selection">
              {periodOptions.map((option) => (
                <button
                  aria-pressed={period === option.value}
                  data-period={option.value}
                  key={option.value}
                  onClick={() => setPeriod(option.value)}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <DataStatus
            state={
              selected.loading ? { status: 'loading' } :
              selected.result?.status === 'error' ? { status: 'error', message: selected.result.error.message, retryable: selected.result.error.retryable } :
              selected.result?.status === 'empty' ? { status: 'empty', message: selected.result.message } :
              series?.period.isFallback ? { status: 'partial', data: series, message: 'Showing latest available period' } :
              { status: 'success', data: series }
            }
          />
          <figure className="chart-shell chart-shell--large" data-utility={utility} aria-label="Main performance chart">
            <svg viewBox="0 0 100 48" role="img" aria-label={`${selectedDefinition?.displayName ?? 'Utility'} ${getPeriodLabel(period)} trend`}>
              <path d={getChartPath(series)} />
            </svg>
            <figcaption>
              {selectedDefinition?.displayName ?? 'Utility'} · {getPeriodLabel(period)} · {metrics.pointCount} records
            </figcaption>
          </figure>
        </article>

        <aside className="resource-side">
          <div className="metric-grid metric-grid--stacked">
            <MetricCard utility={utility} label="Average" value={formatMetricValue(metrics.average, series?.unit ?? '')} detail={getPeriodLabel(period)} />
            <MetricCard utility={utility} label="Peak" value={formatMetricValue(metrics.peak?.value, series?.unit ?? '')} detail={metrics.peak?.timestamp ?? 'n/a'} />
            <MetricCard utility={utility} label="Latest" value={formatMetricValue(metrics.latest?.value, series?.unit ?? '')} detail={metrics.latest?.timestamp ?? 'n/a'} />
            <MetricCard utility={utility} label="Source Timestamp" value={sourceTimestamp} detail={`${metrics.pointCount} normalized records`} />
          </div>
        </aside>
      </section>

      <section className="resource-detail-row" aria-label="Resource performance metadata and related utilities">
        <article className="panel resource-metadata-panel">
          <span className="eyebrow">Period and Source</span>
          <dl className="metadata-grid metadata-grid--compact">
            <div><dt>Requested period</dt><dd>{series ? `${series.period.requestedWindow.start} to ${series.period.requestedWindow.end}` : 'n/a'}</dd></div>
            <div><dt>Effective period</dt><dd>{series?.period.effectiveWindow ? `${series.period.effectiveWindow.start} to ${series.period.effectiveWindow.end}` : 'n/a'}</dd></div>
            <div><dt>Source timestamp</dt><dd>{sourceTimestamp}</dd></div>
            <div><dt>Origin</dt><dd>{series?.provenance.origin ?? 'n/a'}</dd></div>
          </dl>
          <div className="quality-badge-row" aria-label="Quality notices">
            {(series?.qualityNotices.length ? series.qualityNotices : [{ code: 'none', message: 'No quality notices' }]).map((notice) => (
              <span className="quality-badge" key={notice.code}>{notice.code}</span>
            ))}
          </div>
        </article>

        <aside className="resource-compact-utilities" aria-label="Compact related utility summaries">
          {utilityDefinitions
            .filter((definition) => definition.id !== utility)
            .map((definition) => (
              <CompactUtilitySummary
                definition={definition}
                key={definition.id}
                loading={summaries[definition.id].loading}
                result={summaries[definition.id].result}
              />
            ))}
        </aside>
      </section>

      <DisclosureBar>
        Utility datasets update independently and may have different timestamps.
        Building media overlays are analytical visualizations and are not an operational digital twin.
      </DisclosureBar>
    </main>
  )
}

function CompactUtilitySummary({
  definition,
  loading,
  result,
}: {
  definition: UtilityDefinition
  loading: boolean
  result: UtilitySeriesResult | null
}) {
  const series = getSeries(result)
  const latest = series?.latestReading

  return (
    <article className="compact-utility-card" data-utility={definition.id}>
      <span>{definition.displayName}</span>
      <strong>{formatMetricValue(latest?.value, definition.canonicalUnit)}</strong>
      <small>{loading ? 'Loading' : `Latest: ${latest?.sourceTimestamp ?? 'n/a'}`}</small>
    </article>
  )
}

function ResourceOverlay({ utility }: { utility: UtilityId }) {
  if (utility !== 'electricity') {
    return null
  }

  return (
    <svg
      className="resource-overlay resource-overlay--electricity"
      data-overlay="analytical-electricity"
      viewBox="0 0 1000 420"
      aria-hidden="true"
      focusable="false"
    >
      <path className="resource-overlay__path" d="M115 270 C220 238 270 188 366 214 S520 282 638 218 S784 156 900 190" />
      <path className="resource-overlay__path resource-overlay__path--secondary" d="M330 215 L330 115 L420 115 L420 194" />
      <path className="resource-overlay__path resource-overlay__path--secondary" d="M635 220 L635 126 L750 126 L750 174" />
      {[115, 330, 420, 515, 638, 750, 900].map((x, index) => (
        <circle
          className="resource-overlay__node"
          cx={x}
          cy={[270, 215, 194, 254, 218, 174, 190][index]}
          key={x}
          r="4"
        />
      ))}
    </svg>
  )
}
