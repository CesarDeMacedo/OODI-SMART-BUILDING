import { useState } from 'react'
import { utilityDefinitions } from '../../data/utilities/utilityDefinitions'
import type { ProductPeriod, UtilityId } from '../../data/utilities/utilitySeries'
import { useUtilitySeries, useUtilitySummaries } from '../useAppData'
import { MetricCard } from '../../components/cards/MetricCard'
import { UtilitySummaryCard } from '../../components/cards/UtilitySummaryCard'
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

  return (
    <main className="page page--resource" data-layout="resource-performance">
      <section className="resource-hero">
        <div className="resource-hero__intro">
          <span className="eyebrow">Resource Performance</span>
          <h1>Utility performance with public source context</h1>
          <p>
            Explore the latest available Nuuka records by utility and product period.
            Requested periods and effective returned periods remain visible.
          </p>
          <div className="segmented-control" aria-label="Utility selection">
            {utilityOptions.map((option) => (
              <button
                aria-pressed={utility === option.id}
                key={option.id}
                onClick={() => setUtility(option.id)}
                type="button"
              >
                {option.displayName}
              </button>
            ))}
          </div>
        </div>
        <MediaSlot
          asset={mediaAssets.resourcePerformanceHeroMedia}
          className="resource-hero__media"
          overlay={mediaAssets.resourcePerformanceOverlayMedia}
          slotName="resourcePerformanceHeroMedia"
        />
      </section>

      <section className="resource-layout">
        <article className="panel chart-panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Selected Utility</span>
              <h2>{selectedDefinition?.displayName ?? 'Utility'} Performance</h2>
            </div>
            <div className="segmented-control" aria-label="Period selection">
              {periodOptions.map((option) => (
                <button
                  aria-pressed={period === option.value}
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
          <figure className="chart-shell chart-shell--large" aria-label="Main performance chart">
            <svg viewBox="0 0 100 48" role="img" aria-label={`${selectedDefinition?.displayName ?? 'Utility'} ${getPeriodLabel(period)} trend`}>
              <path d={getChartPath(series)} />
            </svg>
            <figcaption>
              {selectedDefinition?.displayName ?? 'Utility'} · {getPeriodLabel(period)} · {metrics.pointCount} records
            </figcaption>
          </figure>
          <dl className="metadata-grid">
            <div><dt>Requested period</dt><dd>{series ? `${series.period.requestedWindow.start} to ${series.period.requestedWindow.end}` : 'n/a'}</dd></div>
            <div><dt>Effective period</dt><dd>{series?.period.effectiveWindow ? `${series.period.effectiveWindow.start} to ${series.period.effectiveWindow.end}` : 'n/a'}</dd></div>
            <div><dt>Source timestamp</dt><dd>{series?.latestReading?.sourceTimestamp ?? 'n/a'}</dd></div>
            <div><dt>Origin</dt><dd>{series?.provenance.origin ?? 'n/a'}</dd></div>
            <div><dt>Quality notices</dt><dd>{series?.qualityNotices.map((notice) => notice.code).join(', ') || 'none'}</dd></div>
          </dl>
        </article>

        <aside className="resource-side">
          <div className="metric-grid metric-grid--stacked">
            <MetricCard label="Average" value={formatMetricValue(metrics.average, series?.unit ?? '')} detail={getPeriodLabel(period)} />
            <MetricCard label="Peak" value={formatMetricValue(metrics.peak?.value, series?.unit ?? '')} detail={metrics.peak?.timestamp ?? 'n/a'} />
            <MetricCard label="Latest" value={formatMetricValue(metrics.latest?.value, series?.unit ?? '')} detail={metrics.latest?.timestamp ?? 'n/a'} />
            <MetricCard label="Records" value={String(metrics.pointCount)} detail="Normalized public-data points" />
          </div>
        </aside>
      </section>

      <section className="utility-grid utility-grid--related" aria-label="Related utility summaries">
        {utilityDefinitions.map((definition) => (
          <UtilitySummaryCard
            definition={definition}
            key={definition.id}
            loading={summaries[definition.id].loading}
            result={summaries[definition.id].result}
            selected={definition.id === utility}
          />
        ))}
      </section>

      <DisclosureBar>
        Utility datasets update independently and may have different timestamps.
        Building media overlays are analytical visualizations and are not an operational digital twin.
      </DisclosureBar>
    </main>
  )
}
