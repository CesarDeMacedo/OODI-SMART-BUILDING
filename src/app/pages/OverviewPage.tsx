import { useState, useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { utilityDefinitions } from '../../data/utilities/utilityDefinitions'
import type { ProductPeriod, UtilityId, UtilitySeries } from '../../data/utilities/utilitySeries'
import { useCurrentWeather, useUtilitySeries, useUtilitySummaries } from '../useAppData'
import type { UtilityLoadState } from '../useAppData'
import { DataStatus } from '../../components/layout/DataStatus'
import type { ModuleState } from '../../components/layout/DataStatus'
import { MediaSlot } from '../../components/layout/MediaSlot'
import { mediaAssets } from '../../content/mediaAssets'
import { cautiousInsights, classificationLabels, conceptualModules } from '../../content/pageContent'
import { getOverviewChartPaths, getSeriesMetrics } from '../../features/resourcePerformance/metrics'
import { periodOptions } from '../../features/resourcePerformance/resourcePerformanceState'

// ─── Utility icon SVGs ────────────────────────────────────────────────────────

const UTILITY_ICONS: Record<UtilityId, ReactNode> = {
  electricity: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13 2 4 14h6l-1 8 9-12h-6z" />
    </svg>
  ),
  heat: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2c1 3-2 4-2 7a2 2 0 0 0 4 0c2 2 3 3.5 3 6a5 5 0 0 1-10 0c0-4 5-6 5-13z" />
    </svg>
  ),
  water: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2c3 5 6 8 6 12a6 6 0 0 1-12 0c0-4 3-7 6-12z" />
    </svg>
  ),
  districtCooling: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19" />
    </svg>
  ),
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function degreesToCompass(deg: number): string {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  return dirs[Math.round(deg / 22.5) % 16]
}

function getSeriesFromLoadState(state: UtilityLoadState): UtilitySeries | undefined {
  const r = state.result
  if (!r) return undefined
  if (r.status === 'error') return r.previousSeries
  return r.series
}

function getModuleStateFromLoadState(state: UtilityLoadState): ModuleState<UtilitySeries> {
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
  const indices = Array.from({ length: count }, (_, i) => Math.round((i * (pts.length - 1)) / (count - 1)))
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

// ─── Component ────────────────────────────────────────────────────────────────

export function OverviewPage() {
  const [selectedUtility, setSelectedUtility] = useState<UtilityId>('electricity')
  const pageRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = pageRef.current
    if (!el) return
    const fit = () => {
      el.style.zoom = ''
      if (window.innerWidth < 1000) return
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
  const [selectedPeriod, setSelectedPeriod] = useState<ProductPeriod>('24h')

  const summaries = useUtilitySummaries('24h')
  const selected = useUtilitySeries(selectedUtility, selectedPeriod)
  const weatherState = useCurrentWeather()

  const selectedSeries = (() => {
    const r = selected.result
    if (!r) return undefined
    return r.status === 'error' ? r.previousSeries : r.series
  })()

  const weather = (() => {
    const r = weatherState.result
    if (!r) return undefined
    if (r.status === 'error') return r.previousWeather
    if (r.status === 'empty') return undefined
    return r.weather
  })()

  const metrics = getSeriesMetrics(selectedSeries)
  const { linePath, areaPath, yMax, peakX, peakY } = getOverviewChartPaths(selectedSeries)
  const xLabels = buildXLabels(selectedSeries, selectedPeriod)
  const selectedDefinition = utilityDefinitions.find((d) => d.id === selectedUtility)

  const yLabels =
    yMax > 0
      ? [yMax, yMax * 0.75, yMax * 0.5, yMax * 0.25, 0].map((v) => formatCompact(v))
      : ['—', '', '', '', '0']

  const weatherModuleState: ModuleState<typeof weather> = weatherState.loading
    ? { status: 'loading' }
    : !weatherState.result
      ? { status: 'loading' }
      : weatherState.result.status === 'error'
        ? { status: 'error', message: weatherState.result.error.message, retryable: weatherState.result.error.retryable }
        : weatherState.result.status === 'empty'
          ? { status: 'empty', message: weatherState.result.message }
          : weatherState.result.status === 'partial'
            ? { status: 'partial', data: weather, message: weatherState.result.message }
            : { status: 'success', data: weather }

  // Electricity summary used as representative public-data timestamp in transparency panel
  const electricitySeries = getSeriesFromLoadState(summaries.electricity)
  const publicDataTimestamp = electricitySeries?.latestReading?.sourceTimestamp ?? '—'

  const insightUtilities = utilityDefinitions

  return (
    <main className="page page--overview" data-layout="overview" ref={pageRef}>

      {/* ── Row 1: Hero + Building Context ── */}
      <section className="ovw-hero" aria-label="Building overview">

        <article className="panel ovw-hero__card" aria-label="Oodi building hero">
          <MediaSlot asset={mediaAssets.overviewHeroMedia} slotName="overviewHeroMedia" />
          <div className="ovw-hero__copy">
            <div>
              <h1>Oodi</h1>
              <p className="ovw-hero__location">Helsinki, Finland</p>
              <p className="ovw-hero__desc">
                Public-building intelligence prototype combining utility data, weather context and conceptual operational insights.
              </p>
            </div>
            <div className="ovw-hero__tags">
              <span className="ovw-tag ovw-tag--public">
                <span className="ovw-tag__dot" aria-hidden="true" />
                Public Utility Data Available
              </span>
              <span className="ovw-tag ovw-tag--conceptual">
                <span className="ovw-tag__dot" aria-hidden="true" />
                {classificationLabels.conceptual.label}
              </span>
            </div>
          </div>
        </article>

        <article className="panel ovw-context" aria-label="Building context and current weather">
          <div className="ovw-context__header">
            <div className="ovw-icon-box ovw-icon-box--building" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M15 9h.01M9 13h.01M15 13h.01M9 17h.01M15 17h.01" />
              </svg>
            </div>
            <div>
              <strong className="ovw-context__title">Building Context</strong>
              <span className="ovw-context__subtitle">Helsinki, Finland · Public Library</span>
            </div>
          </div>

          <p className="ovw-context__source-label">Current weather from Open-Meteo</p>

          {weather ? (
            <div className="ovw-weather-body">
              <div className="ovw-weather-main">
                <div className="ovw-temp-block">
                  <span className="ovw-temp">{weather.current.temperatureC.toFixed(1)}</span>
                  <span className="ovw-temp-unit">°C</span>
                </div>
                <span className="ovw-weather-condition">{weather.current.condition.label}</span>
              </div>
              <dl className="ovw-weather-details">
                <div>
                  <dt>Feels like</dt>
                  <dd>{weather.current.apparentTemperatureC.toFixed(1)} °C</dd>
                </div>
                <div>
                  <dt>Wind</dt>
                  <dd>
                    {(weather.current.windSpeedKmh / 3.6).toFixed(0)} m/s{' '}
                    {degreesToCompass(weather.current.windDirectionDegrees)}
                  </dd>
                </div>
                <div>
                  <dt>Humidity</dt>
                  <dd>{weather.current.relativeHumidityPercent}%</dd>
                </div>
                <div>
                  <dt>Cloud cover</dt>
                  <dd>{weather.current.cloudCoverPercent}%</dd>
                </div>
              </dl>
            </div>
          ) : (
            <p className="ovw-context__no-weather">Weather context unavailable</p>
          )}

          <div className="ovw-context__footer">
            <p className="ovw-context__observed">
              {weather ? `Observed · ${weather.current.sourceTimestamp}` : '—'}
            </p>
            <DataStatus state={weatherModuleState} />
            <p className="ovw-context__disclaimer">
              Utility datasets update independently of weather data.
            </p>
          </div>
        </article>
      </section>

      {/* ── Middle: left (utility cards + chart) | right (insights) ── */}
      <section className="ovw-middle" aria-label="Resource performance and insights">

        <div className="ovw-middle__left">

          {/* Row 2: 4 utility summary cards */}
          <div className="ovw-utility-row" role="list" aria-label="Utility summaries">
            {utilityDefinitions.map((def) => {
              const state = summaries[def.id]
              const series = getSeriesFromLoadState(state)
              const latest = series?.latestReading
              const moduleState = getModuleStateFromLoadState(state)
              const isSelected = selectedUtility === def.id

              return (
                <button
                  className={`ovw-utility-btn${isSelected ? ' ovw-utility-btn--selected' : ''}`}
                  data-utility={def.id}
                  key={def.id}
                  onClick={() => setSelectedUtility(def.id)}
                  role="listitem"
                  type="button"
                  aria-pressed={isSelected}
                >
                  <div className="ovw-utility-card__header">
                    <div className="ovw-utility-card__title-row">
                      <div className="ovw-icon-box" aria-hidden="true">
                        {UTILITY_ICONS[def.id]}
                      </div>
                      <span className="ovw-utility-card__name">{def.displayName}</span>
                    </div>
                    <span className="ovw-granularity-badge">
                      {series?.period.requestedGranularity ?? 'Hourly'}
                    </span>
                  </div>
                  <strong className="ovw-utility-card__value">
                    {latest
                      ? `${latest.value.toLocaleString(undefined, { maximumFractionDigits: 1 })} ${series?.unit ?? def.canonicalUnit}`
                      : state.loading ? '…' : 'n/a'}
                  </strong>
                  <p className="ovw-utility-card__ts">
                    {latest ? `Latest · ${latest.sourceTimestamp}` : 'No data'}
                  </p>
                  <div className="ovw-utility-card__footer">
                    <span className="ovw-source-label">Nuuka Open API</span>
                    <DataStatus state={moduleState} />
                  </div>
                </button>
              )
            })}
          </div>

          {/* Row 3: Chart panel */}
          <article className="panel ovw-chart-panel" aria-label={`Resource performance chart — ${selectedDefinition?.displayName ?? 'utility'}`}>
            <div className="ovw-chart-panel__header">
              <div className="ovw-chart-panel__title-row">
                <div className="ovw-icon-box" data-utility={selectedUtility} aria-hidden="true">
                  {selectedDefinition && UTILITY_ICONS[selectedDefinition.id]}
                </div>
                <h2 className="ovw-chart-panel__title">
                  Resource Performance — {selectedDefinition?.displayName ?? 'Utility'}
                </h2>
              </div>
              <div className="ovw-period-tabs" role="group" aria-label="Time period selector">
                {periodOptions.map((opt) => (
                  <button
                    key={opt.value}
                    className={`ovw-period-tab${selectedPeriod === opt.value ? ' ovw-period-tab--active' : ''}`}
                    aria-pressed={selectedPeriod === opt.value}
                    data-utility={selectedUtility}
                    onClick={() => setSelectedPeriod(opt.value)}
                    type="button"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="ovw-chart-body">
              {/* SVG chart area */}
              <div className="ovw-chart-area">
                <span className="ovw-chart-axis-label" aria-hidden="true">
                  {selectedSeries?.unit ?? selectedDefinition?.canonicalUnit ?? ''}
                </span>
                <div className="ovw-chart-inner">
                  <div className="ovw-chart-yaxis" aria-hidden="true">
                    {yLabels.map((label, i) => (
                      <span key={i}>{label}</span>
                    ))}
                  </div>
                  <div className="ovw-chart-svg-wrap" data-utility={selectedUtility}>
                    {selected.loading ? (
                      <p className="ovw-chart-placeholder">Loading chart data…</p>
                    ) : linePath ? (
                      <>
                        <svg
                          viewBox="0 0 600 180"
                          preserveAspectRatio="none"
                          className="ovw-chart-svg"
                          role="img"
                          aria-label={`${selectedDefinition?.displayName ?? 'Utility'} trend for selected period`}
                        >
                          <defs>
                            <linearGradient id="ovwChartFill" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="var(--utility-accent)" stopOpacity="0.32" />
                              <stop offset="100%" stopColor="var(--utility-accent)" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          {[12, 54, 96, 138, 180].map((y) => (
                            <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
                          ))}
                          <path d={areaPath} fill="url(#ovwChartFill)" />
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
                                x1={peakX}
                                y1={peakY}
                                x2={peakX}
                                y2="180"
                                stroke="var(--utility-accent)"
                                strokeWidth="1"
                                strokeDasharray="3 3"
                                opacity="0.5"
                                vectorEffect="non-scaling-stroke"
                              />
                              <circle
                                cx={peakX}
                                cy={peakY}
                                r="4"
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

              {/* Stats + metadata */}
              <div className="ovw-chart-stats" data-utility={selectedUtility}>
                <div className="ovw-chart-metrics">
                  <div className="ovw-chart-metric">
                    <span className="ovw-chart-metric__label">Average</span>
                    <div className="ovw-chart-metric__row">
                      <strong className="ovw-chart-metric__value">
                        {metrics.average !== null ? metrics.average.toLocaleString(undefined, { maximumFractionDigits: 1 }) : '—'}
                      </strong>
                      <span className="ovw-chart-metric__unit">{selectedSeries?.unit ?? ''}</span>
                    </div>
                  </div>
                  <div className="ovw-chart-metric ovw-chart-metric--accent">
                    <span className="ovw-chart-metric__label">Peak</span>
                    <div className="ovw-chart-metric__row">
                      <strong className="ovw-chart-metric__value">
                        {metrics.peak !== null ? metrics.peak.value.toLocaleString(undefined, { maximumFractionDigits: 1 }) : '—'}
                      </strong>
                      <span className="ovw-chart-metric__unit">{selectedSeries?.unit ?? ''}</span>
                    </div>
                  </div>
                  <div className="ovw-chart-metric">
                    <span className="ovw-chart-metric__label">Latest</span>
                    <div className="ovw-chart-metric__row">
                      <strong className="ovw-chart-metric__value">
                        {metrics.latest !== null ? metrics.latest.value.toLocaleString(undefined, { maximumFractionDigits: 1 }) : '—'}
                      </strong>
                      <span className="ovw-chart-metric__unit">{selectedSeries?.unit ?? ''}</span>
                    </div>
                  </div>
                </div>

                <dl className="ovw-period-meta">
                  <div>
                    <dt>Requested</dt>
                    <dd className="ovw-mono">{selectedSeries?.period.requestedPeriod ?? selectedPeriod}</dd>
                  </div>
                  <div>
                    <dt>Effective</dt>
                    <dd className="ovw-mono">
                      {selectedSeries?.period.effectiveWindow
                        ? `${selectedSeries.period.effectiveWindow.start} – ${selectedSeries.period.effectiveWindow.end}`
                        : '—'}
                    </dd>
                  </div>
                  <div>
                    <dt>Source</dt>
                    <dd className="ovw-mono">{selectedSeries?.latestReading?.sourceTimestamp ?? '—'}</dd>
                  </div>
                </dl>

                <div className="ovw-chart-legend" aria-hidden="true">
                  <span className="ovw-legend-item">
                    <span className="ovw-legend-dot ovw-legend-dot--utility" />
                    Nuuka Open API
                  </span>
                  <span className="ovw-legend-item">
                    <span className="ovw-legend-dot ovw-legend-dot--weather" />
                    Hourly
                  </span>
                  <span className="ovw-legend-item">
                    <span className="ovw-legend-dot ovw-legend-dot--conceptual" />
                    UTC+3
                  </span>
                </div>
              </div>
            </div>
          </article>
        </div>

        {/* Insights panel */}
        <article className="panel ovw-insights" aria-label="Insights">
          <div className="ovw-insights__header">
            <div className="ovw-icon-box ovw-icon-box--insights" aria-hidden="true">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M9 18h6M10 21h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.2 1 2h6c0-.8.4-1.5 1-2A7 7 0 0 0 12 2z" />
              </svg>
            </div>
            <h2>Insights</h2>
          </div>

          {insightUtilities.map((def, i) => {
            const state = summaries[def.id]
            const series = getSeriesFromLoadState(state)
            const latest = series?.latestReading
            const isFirst = i === 0

            const title = latest
              ? `${def.displayName}: ${latest.value.toLocaleString(undefined, { maximumFractionDigits: 1 })} ${series?.unit ?? def.canonicalUnit}`
              : def.displayName

            return (
              <div
                key={def.id}
                className={`ovw-insight-row${isFirst ? ' ovw-insight-row--highlight' : ''}`}
                data-utility={def.id}
              >
                <div className="ovw-icon-box ovw-icon-box--sm" aria-hidden="true">
                  {UTILITY_ICONS[def.id]}
                </div>
                <div className="ovw-insight-row__content">
                  <strong className="ovw-insight-row__title">{title}</strong>
                  <p className="ovw-insight-row__text">{cautiousInsights[i]}</p>
                </div>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="ovw-insight-row__arrow">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </div>
            )
          })}

          <p className="ovw-insights__disclaimer">
            Insights are generated from public &amp; conceptual data.
          </p>
        </article>
      </section>

      {/* ── Row 4: Building Intelligence + Data Transparency ── */}
      <section className="ovw-bottom" aria-label="Building intelligence and data transparency">

        <article className="panel ovw-intelligence" aria-label="Building intelligence — conceptual layer">
          <div className="ovw-intelligence__header">
            <div className="ovw-icon-box ovw-icon-box--conceptual" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 4a3 3 0 0 0-3 3 3 3 0 0 0-1 5.8V17a2 2 0 0 0 4 0M12 4a3 3 0 0 1 3 3 3 3 0 0 1 1 5.8V17a2 2 0 0 1-4 0M12 4v13" />
              </svg>
            </div>
            <h2>Building Intelligence</h2>
            <span className="classification-badge classification-badge--conceptual">
              <span className="classification-badge__icon" aria-hidden="true">I</span>
              {classificationLabels.conceptual.label}
            </span>
          </div>
          <p className="ovw-intelligence__note">
            Illustrative insights only. Not real-time operational data.
          </p>
          <div className="ovw-module-grid">
            {conceptualModules.map((module) => (
              <div key={module.title} className="ovw-module-card">
                <strong className="ovw-module-card__title">{module.title}</strong>
                <span className={`ovw-module-card__status${module.statusVariant === 'warning' ? ' ovw-module-card__status--warning' : ''}`}>
                  {module.status}
                </span>
                <p className="ovw-module-card__desc">{module.description}</p>
              </div>
            ))}
          </div>
          <p className="ovw-intelligence__footer">
            Conceptual layer uses public data &amp; models. Not a live building management system.
          </p>
        </article>

        <article className="panel ovw-transparency" aria-label="Data transparency">
          <div className="ovw-transparency__header">
            <div className="ovw-icon-box ovw-icon-box--building" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <ellipse cx="12" cy="5" rx="8" ry="3" />
                <path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
              </svg>
            </div>
            <h2>Data Transparency</h2>
          </div>

          <div className="ovw-transparency__rows">
            {/* Public utility data */}
            <div className="ovw-tr-row" data-classification="public-utility">
              <div className="ovw-icon-box ovw-icon-box--sm ovw-icon-box--public" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <ellipse cx="12" cy="6" rx="7" ry="2.5" />
                  <path d="M5 6v12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V6" />
                </svg>
              </div>
              <div className="ovw-tr-row__info">
                <strong>Public Data</strong>
                <span>Utility datasets via Nuuka Open API</span>
              </div>
              <div className="ovw-tr-row__ts">
                <span className="ovw-mono">{publicDataTimestamp}</span>
                <span className="ovw-sub">Hourly</span>
              </div>
              <DataStatus state={getModuleStateFromLoadState(summaries.electricity)} />
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </div>

            {/* Current weather */}
            <div className="ovw-tr-row" data-classification="current-weather">
              <div className="ovw-icon-box ovw-icon-box--sm ovw-icon-box--weather" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M7 18a4 4 0 0 1-.4-7.98A5 5 0 0 1 17 11a3.5 3.5 0 0 1 0 7H7z" />
                </svg>
              </div>
              <div className="ovw-tr-row__info">
                <strong>Current Weather</strong>
                <span>Open-Meteo</span>
              </div>
              <div className="ovw-tr-row__ts">
                <span className="ovw-mono">{weather?.current.sourceTimestamp ?? '—'}</span>
                <span className="ovw-sub">Current</span>
              </div>
              <DataStatus state={weatherModuleState} />
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </div>

            {/* Conceptual data */}
            <div className="ovw-tr-row" data-classification="conceptual">
              <div className="ovw-icon-box ovw-icon-box--sm ovw-icon-box--conceptual" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 4a3 3 0 0 0-3 3 3 3 0 0 0-1 5.8V17a2 2 0 0 0 4 0M12 4a3 3 0 0 1 3 3 3 3 0 0 1 1 5.8V17a2 2 0 0 1-4 0M12 4v13" />
                </svg>
              </div>
              <div className="ovw-tr-row__info">
                <strong>Conceptual Data</strong>
                <span>Modelled &amp; simulated layer</span>
              </div>
              <div className="ovw-tr-row__ts">
                <span className="ovw-mono">Illustrative</span>
                <span className="ovw-sub">Conceptual</span>
              </div>
              <DataStatus state={{ status: 'conceptual', message: 'Illustrative layer' }} />
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </div>
          </div>

          <a className="text-link" href="#/data-transparency">
            Explore Data Transparency &amp; Methodology
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
        </article>
      </section>
    </main>
  )
}
