import { useState, useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { utilityDefinitions } from '../../data/utilities/utilityDefinitions'
import type { ProductPeriod, UtilityId, UtilitySeries } from '../../data/utilities/utilitySeries'
import { useUtilitySeries, useUtilitySummaries } from '../useAppData'
import type { UtilityLoadState } from '../useAppData'
import type { ModuleState } from '../../components/layout/DataStatus'
import { DataStatus } from '../../components/layout/DataStatus'
import { MediaSlot } from '../../components/layout/MediaSlot'
import { mediaAssets } from '../../content/mediaAssets'
import {
  getOverviewChartPaths,
  getChartPath,
  getSeriesMetrics,
} from '../../features/resourcePerformance/metrics'
import {
  getPeriodLabel,
  periodOptions,
  utilityOptions,
} from '../../features/resourcePerformance/resourcePerformanceState'

// ─── Icons ────────────────────────────────────────────────────────────────────

const UTILITY_ICONS: Record<UtilityId, ReactNode> = {
  electricity: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13 2 4 14h6l-1 8 9-12h-6z" />
    </svg>
  ),
  heat: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2c1 3-2 4-2 7a2 2 0 0 0 4 0c2 2 3 3.5 3 6a5 5 0 0 1-10 0c0-4 5-6 5-13z" />
    </svg>
  ),
  water: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2c3 5 6 8 6 12a6 6 0 0 1-12 0c0-4 3-7 6-12z" />
    </svg>
  ),
  districtCooling: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19" />
    </svg>
  ),
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getSeries(result: ReturnType<typeof useUtilitySeries>['result']) {
  if (!result) return undefined
  return result.status === 'error' ? result.previousSeries : result.series
}

function getModuleState(state: UtilityLoadState): ModuleState<UtilitySeries> {
  if (state.loading) return { status: 'loading' }
  const r = state.result
  if (!r) return { status: 'loading' }
  if (r.status === 'error') return { status: 'error', message: r.error.message, retryable: r.error.retryable }
  const series = r.series
  if (r.status === 'empty') return { status: 'empty', message: r.message }
  if (series.provenance.origin === 'snapshot') return { status: 'cached-public-snapshot', message: 'Cached public snapshot' }
  if (series.provenance.origin === 'memory-cache') return { status: 'memory-cache', message: 'Memory cache' }
  if (series.period.isFallback) return { status: 'partial', data: series, message: 'Latest available period' }
  return { status: 'success', data: series }
}

function buildXLabels(series: UtilitySeries | undefined, period: ProductPeriod): string[] {
  if (!series || series.points.length === 0) return []
  const pts = series.points
  const wantCount = period === '12m' ? 6 : 9
  const count = Math.min(wantCount, pts.length)
  if (count < 2) return []
  const indices = Array.from({ length: count }, (_, i) =>
    Math.round((i * (pts.length - 1)) / (count - 1))
  )
  return indices.map((idx) => {
    const ts = pts[idx].sourceTimestamp
    try {
      const d = new Date(ts)
      if (period === '24h') return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Helsinki' })
      if (period === '30d') return d.toLocaleDateString('en-GB', { month: 'short', day: 'numeric', timeZone: 'Europe/Helsinki' })
      return d.toLocaleDateString('en-GB', { month: 'short', timeZone: 'Europe/Helsinki' })
    } catch {
      return ts.slice(0, 10)
    }
  })
}

function formatCompact(value: number): string {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`
  return value.toFixed(value < 10 ? 2 : value < 100 ? 1 : 0)
}

// ─── Page ────────────────────────────────────────────────────────────────────

export function ResourcePerformancePage() {
  const [utility, setUtility] = useState<UtilityId>('electricity')
  const [period, setPeriod] = useState<ProductPeriod>('24h')
  const pageRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = pageRef.current
    if (!el) return
    const fit = () => {
      el.style.zoom = ''
      const shell = el.closest('.app-shell')
      const navH = (shell?.querySelector('.top-nav') as HTMLElement | null)?.offsetHeight ?? 50
      const footH = (shell?.querySelector('.app-footer') as HTMLElement | null)?.offsetHeight ?? 28
      const available = window.innerHeight - navH - footH
      const naturalH = el.scrollHeight
      if (naturalH > available && available > 200) {
        el.style.zoom = Math.max(0.55, available / naturalH).toFixed(3)
      }
    }
    const t = setTimeout(fit, 150)
    window.addEventListener('resize', fit)
    return () => { clearTimeout(t); window.removeEventListener('resize', fit) }
  }, [])

  const selected = useUtilitySeries(utility, period)
  const summaries = useUtilitySummaries('24h')

  const series = getSeries(selected.result)
  const metrics = getSeriesMetrics(series)
  const { linePath, areaPath, yMax, peakX, peakY } = getOverviewChartPaths(series)
  const xLabels = buildXLabels(series, period)
  const selectedDefinition = utilityDefinitions.find((d) => d.id === utility)
  const sourceTimestamp = series?.latestReading?.sourceTimestamp ?? '—'
  const unit = series?.unit ?? selectedDefinition?.canonicalUnit ?? ''
  const granularity = series?.period.requestedGranularity ?? 'hourly'
  const granularityLabel = granularity.charAt(0).toUpperCase() + granularity.slice(1)

  const moduleState: ModuleState<UtilitySeries> = selected.loading
    ? { status: 'loading' }
    : !selected.result
      ? { status: 'loading' }
      : selected.result.status === 'error'
        ? { status: 'error', message: selected.result.error.message, retryable: selected.result.error.retryable }
        : selected.result.status === 'empty'
          ? { status: 'empty', message: selected.result.message }
          : selected.result.series.provenance.origin === 'snapshot'
            ? { status: 'cached-public-snapshot', message: 'Cached public snapshot' }
            : selected.result.series.provenance.origin === 'memory-cache'
              ? { status: 'memory-cache', message: 'Memory cache' }
              : selected.result.series.period.isFallback
                ? { status: 'partial', data: selected.result.series, message: 'Latest available period' }
                : { status: 'success', data: selected.result.series }

  const yLabels =
    yMax > 0
      ? [yMax, yMax * 0.75, yMax * 0.5, yMax * 0.25, 0].map((v) => formatCompact(v))
      : ['—', '', '', '', '0']

  const requestedPeriodStr = series?.period.requestedPeriod ?? period
  const effectivePeriodStr = series?.period.effectiveWindow
    ? `${series.period.effectiveWindow.start} – ${series.period.effectiveWindow.end}`
    : '—'

  const relatedUtilities = utilityDefinitions.filter((d) => d.id !== utility)

  return (
    <main className="page page--resource" data-layout="resource-performance" ref={pageRef}>

      {/* ── Title row ── */}
      <div className="rp-title-row">
        <div className="rp-title-row__left">
          <div className="rp-page-icon ovw-icon-box" data-utility={utility} aria-hidden="true">
            {UTILITY_ICONS[utility]}
          </div>
          <h1>Resource Performance</h1>
          <span className="rp-title-sep" aria-hidden="true" />
          <div className="rp-utility-tabs" role="group" aria-label="Select utility" data-control="utility-selector">
            {utilityOptions.map((opt) => (
              <button
                key={opt.id}
                className={`rp-utility-tab${utility === opt.id ? ' rp-utility-tab--active' : ''}`}
                data-utility={opt.id}
                aria-pressed={utility === opt.id}
                onClick={() => setUtility(opt.id)}
                type="button"
              >
                <span className="rp-utility-tab__icon" aria-hidden="true">
                  {UTILITY_ICONS[opt.id]}
                </span>
                {opt.displayName}
              </button>
            ))}
          </div>
        </div>
        <div className="rp-title-row__right">
          <span className="rp-title-meta">
            Building: <strong>Oodi Helsinki</strong>
          </span>
          <span className="rp-title-ts ovw-mono">{sourceTimestamp}</span>
          <DataStatus state={moduleState} />
        </div>
      </div>

      {/* ── Hero + KPI row ── */}
      <div className="rp-hero-kpi">

        {/* Hero strip */}
        <div className="rp-hero-strip panel" data-utility={utility}>
          <MediaSlot
            asset={mediaAssets.resourcePerformanceHeroMedia}
            className="rp-hero-strip__media"
            slotName="resourcePerformanceHeroMedia"
          />
          <div className="rp-hero-strip__overlay" aria-hidden="true" />
          <ResourceOverlay utility={utility} />
          <div className="rp-hero-strip__content">
            <div className="rp-hero-strip__utility-row">
              <div className="rp-hero-strip__icon ovw-icon-box" data-utility={utility} aria-hidden="true">
                {UTILITY_ICONS[utility]}
              </div>
              <span className="rp-hero-strip__name">{selectedDefinition?.displayName ?? 'Utility'}</span>
            </div>
            <div className="rp-hero-strip__location">Helsinki · Oodi · {unit}</div>
            <div className="rp-hero-strip__badges">
              <span className="rp-badge rp-badge--source">Nuuka Open API</span>
              <DataStatus state={moduleState} />
            </div>
          </div>
        </div>

        {/* KPI: Average */}
        <div className="rp-kpi-card">
          <div className="rp-kpi-card__label">Average</div>
          <div className="rp-kpi-card__value-row">
            <span className="rp-kpi-card__value">
              {metrics.average !== null
                ? metrics.average.toLocaleString(undefined, { maximumFractionDigits: 1 })
                : '—'}
            </span>
            <span className="rp-kpi-card__unit">{unit}</span>
          </div>
          <div className="rp-kpi-card__detail">Mean power · {getPeriodLabel(period)}</div>
        </div>

        {/* KPI: Peak */}
        <div className="rp-kpi-card rp-kpi-card--accent" data-utility={utility}>
          <div className="rp-kpi-card__label">Peak</div>
          <div className="rp-kpi-card__value-row">
            <span className="rp-kpi-card__value rp-kpi-card__value--accent">
              {metrics.peak !== null
                ? metrics.peak.value.toLocaleString(undefined, { maximumFractionDigits: 1 })
                : '—'}
            </span>
            <span className="rp-kpi-card__unit">{unit}</span>
          </div>
          <div className="rp-kpi-card__detail rp-kpi-card__detail--accent">
            Maximum observed · {getPeriodLabel(period)}
          </div>
        </div>

        {/* KPI: Latest */}
        <div className="rp-kpi-card">
          <div className="rp-kpi-card__label">Latest</div>
          <div className="rp-kpi-card__value-row">
            <span className="rp-kpi-card__value">
              {metrics.latest !== null
                ? metrics.latest.value.toLocaleString(undefined, { maximumFractionDigits: 1 })
                : '—'}
            </span>
            <span className="rp-kpi-card__unit">{unit}</span>
          </div>
          <div className="rp-kpi-card__detail ovw-mono">{metrics.latest?.timestamp ?? sourceTimestamp}</div>
        </div>

        {/* KPI: Source Timestamp */}
        <div className="rp-kpi-card">
          <div className="rp-kpi-card__label">Source Timestamp</div>
          <div className="rp-kpi-card__ts ovw-mono">{sourceTimestamp}</div>
          <div className="rp-kpi-card__source">
            <div className="rp-kpi-card__source-label">Helsinki Nuuka Open API</div>
            <div className="rp-kpi-card__source-dots">
              <span className="rp-status-dot rp-status-dot--available" aria-hidden="true" />
              <span className="rp-status-text rp-status-text--available">Available</span>
              <span className="rp-status-dot rp-status-dot--hourly" aria-hidden="true" />
              <span className="rp-status-text">{granularityLabel}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Chart panel ── */}
      <article
        className="rp-chart-panel panel"
        data-utility={utility}
        aria-label={`${selectedDefinition?.displayName ?? 'Utility'} performance chart`}
      >
        <div className="rp-chart-panel__header">
          <div className="rp-chart-panel__title-row">
            <div className="ovw-icon-box" data-utility={utility} aria-hidden="true">
              {UTILITY_ICONS[utility]}
            </div>
            <h2 className="rp-chart-panel__title">
              {selectedDefinition?.displayName ?? 'Utility'} Performance
            </h2>
            <span className="rp-chart-panel__subtitle">
              {unit} · Helsinki Nuuka Open API · UTC+3
            </span>
          </div>
          <div className="ovw-period-tabs" role="group" aria-label="Time period selector" data-control="period-selector">
            {periodOptions.map((opt) => (
              <button
                key={opt.value}
                className={`ovw-period-tab${period === opt.value ? ' ovw-period-tab--active' : ''}`}
                aria-pressed={period === opt.value}
                data-utility={utility}
                onClick={() => setPeriod(opt.value)}
                type="button"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rp-chart-body">
          {/* Chart area — reuse ovw-chart-* classes */}
          <div className="ovw-chart-area">
            <span className="ovw-chart-axis-label" aria-hidden="true">{unit}</span>
            <div className="ovw-chart-inner">
              <div className="ovw-chart-yaxis" aria-hidden="true">
                {yLabels.map((label, i) => <span key={i}>{label}</span>)}
              </div>
              <div className="ovw-chart-svg-wrap" data-utility={utility}>
                {selected.loading ? (
                  <p className="ovw-chart-placeholder">Loading chart data…</p>
                ) : linePath ? (
                  <>
                    <svg
                      viewBox="0 0 600 180"
                      preserveAspectRatio="none"
                      className="ovw-chart-svg"
                      role="img"
                      aria-label={`${selectedDefinition?.displayName ?? 'Utility'} trend for ${getPeriodLabel(period)}`}
                    >
                      <defs>
                        <linearGradient id="rpChartFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--utility-accent)" stopOpacity="0.32" />
                          <stop offset="100%" stopColor="var(--utility-accent)" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      {[12, 54, 96, 138, 180].map((y) => (
                        <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
                      ))}
                      <path d={areaPath} fill="url(#rpChartFill)" />
                      <path
                        d={linePath}
                        fill="none"
                        stroke="var(--utility-accent)"
                        strokeWidth="2"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                      />
                      {peakX >= 0 && (
                        <g aria-hidden="true">
                          <line
                            x1={peakX} y1={peakY} x2={peakX} y2="180"
                            stroke="var(--utility-accent)"
                            strokeWidth="1"
                            strokeDasharray="3 3"
                            opacity="0.5"
                            vectorEffect="non-scaling-stroke"
                          />
                          <circle
                            cx={peakX} cy={peakY} r="4"
                            fill="var(--utility-accent)"
                            stroke="var(--color-bg-app)"
                            strokeWidth="2"
                            vectorEffect="non-scaling-stroke"
                          />
                        </g>
                      )}
                    </svg>
                    {xLabels.length > 0 && (
                      <div className="ovw-chart-xaxis" aria-hidden="true">
                        {xLabels.map((label, i) => <span key={i}>{label}</span>)}
                      </div>
                    )}
                  </>
                ) : (
                  <p className="ovw-chart-placeholder">
                    {selected.result?.status === 'error'
                      ? 'Chart data unavailable'
                      : 'No data for selected period'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right panel: period details + legend */}
          <div className="rp-chart-right">
            <dl className="rp-period-details">
              <div className="rp-period-details__header">Period Details</div>
              <div>
                <dt>Requested</dt>
                <dd className="ovw-mono">{requestedPeriodStr}</dd>
              </div>
              <div>
                <dt>Effective</dt>
                <dd className="ovw-mono">{effectivePeriodStr}</dd>
              </div>
              <div>
                <dt>Source</dt>
                <dd className="ovw-mono">{sourceTimestamp}</dd>
              </div>
              <div className="rp-period-details__divider" />
              <div>
                <dt>Origin</dt>
                <dd>Helsinki Nuuka API</dd>
              </div>
              <div>
                <dt>Quality</dt>
                <dd className="rp-period-details__quality">
                  <span className="rp-status-dot rp-status-dot--available" aria-hidden="true" />
                  {granularityLabel} · UTC+3
                </dd>
              </div>
            </dl>
            <div className="ovw-chart-legend">
              <span className="ovw-legend-item">
                <span className="rp-legend-line ovw-legend-dot--utility" />
                {selectedDefinition?.displayName ?? 'Utility'} ({unit})
              </span>
              <span className="ovw-legend-item">
                <span className="ovw-legend-dot ovw-legend-dot--utility" />
                Peak marker
              </span>
              <span className="ovw-legend-item">
                <span className="ovw-legend-dot ovw-legend-dot--weather" />
                {granularityLabel}
              </span>
              <span className="ovw-legend-item">
                <span className="ovw-legend-dot ovw-legend-dot--conceptual" />
                UTC+3
              </span>
            </div>
          </div>
        </div>
      </article>

      {/* ── Bottom row: related utilities + data notice ── */}
      <div className="rp-bottom resource-compact-utilities">
        {relatedUtilities.map((def) => (
          <RelatedUtilitySummary
            key={def.id}
            utilityId={def.id}
            displayName={def.displayName}
            loadState={summaries[def.id]}
          />
        ))}
        <article className="rp-data-notice" aria-label="Data Notice">
          <div className="rp-data-notice__header">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8h.01M11 12h1v4h1" />
            </svg>
            <strong className="rp-data-notice__title">Data Notice</strong>
          </div>
          <p className="rp-data-notice__body">
            Utility data is sourced from the Helsinki Nuuka Open API (public). Values represent readings at
            hourly intervals. This prototype reads historical records. Datasets update independently and
            this is not an operational digital twin.
          </p>
          <div className="rp-data-notice__footer">
            <div className="rp-data-notice__row">
              <span>Origin</span>
              <span>Helsinki Nuuka Open API</span>
            </div>
            <div className="rp-data-notice__row">
              <span>Quality</span>
              <span className="rp-data-notice__quality">
                <span className="rp-status-dot rp-status-dot--available" aria-hidden="true" />
                {granularityLabel} · Validated
              </span>
            </div>
            <div className="rp-data-notice__row">
              <span>Timezone</span>
              <span className="ovw-mono">UTC+3 (EEST)</span>
            </div>
          </div>
        </article>
      </div>
    </main>
  )
}

// ─── Electricity overlay ──────────────────────────────────────────────────────

function ResourceOverlay({ utility }: { utility: UtilityId }) {
  if (utility !== 'electricity') return null
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

// ─── Related utility summary card ─────────────────────────────────────────────

function RelatedUtilitySummary({
  utilityId,
  displayName,
  loadState,
}: {
  utilityId: UtilityId
  displayName: string
  loadState: UtilityLoadState
}) {
  const series = getSeries(loadState.result)
  const latest = series?.latestReading
  const unit = series?.unit ?? ''
  const chartPath = getChartPath(series)
  const moduleState = getModuleState(loadState)
  const ts = latest?.sourceTimestamp ?? '—'

  return (
    <article className="rp-summary-card" data-utility={utilityId}>
      <div className="rp-summary-card__header">
        <div className="rp-summary-card__title-row">
          <div className="ovw-icon-box ovw-icon-box--sm" data-utility={utilityId} aria-hidden="true">
            {UTILITY_ICONS[utilityId]}
          </div>
          <span className="rp-summary-card__name">{displayName}</span>
        </div>
        <DataStatus state={moduleState} />
      </div>
      <div className="rp-summary-card__body">
        <div>
          <div className="rp-summary-card__value-row">
            <span className="rp-summary-card__value">
              {loadState.loading
                ? '…'
                : latest != null
                  ? latest.value.toLocaleString(undefined, { maximumFractionDigits: 2 })
                  : '—'}
            </span>
            <span className="rp-summary-card__unit">{unit}</span>
          </div>
          <div className="rp-summary-card__sub">Latest hour</div>
        </div>
        {chartPath ? (
          <svg
            viewBox="0 0 100 44"
            className="rp-summary-card__chart"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d={chartPath}
              fill="none"
              stroke="var(--utility-accent)"
              strokeWidth="1.5"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ) : null}
      </div>
      <div className="rp-summary-card__footer">
        <span>Source: Nuuka Open API</span>
        <span className="ovw-mono">{ts}</span>
      </div>
    </article>
  )
}
