import { useState } from 'react'
import { oodiConfig } from '../../config/oodi'
import { utilityDefinitions } from '../../data/utilities/utilityDefinitions'
import type { ProductPeriod, UtilityId } from '../../data/utilities/utilitySeries'
import { useCurrentWeather, useUtilitySeries, useUtilitySummaries } from '../useAppData'
import { InsightCard } from '../../components/cards/InsightCard'
import { MetricCard } from '../../components/cards/MetricCard'
import { TransparencyRow } from '../../components/cards/TransparencyRow'
import { UtilitySummaryCard } from '../../components/cards/UtilitySummaryCard'
import { ClassificationBadge, DataStatus } from '../../components/layout/DataStatus'
import { MediaSlot } from '../../components/layout/MediaSlot'
import { mediaAssets } from '../../content/mediaAssets'
import { cautiousInsights, classificationLabels, conceptualModules } from '../../content/pageContent'
import { formatMetricValue, getChartPath, getSeriesMetrics } from '../../features/resourcePerformance/metrics'
import { getPeriodLabel, periodOptions } from '../../features/resourcePerformance/resourcePerformanceState'

function getSeries(result: ReturnType<typeof useUtilitySeries>['result']) {
  if (!result) return undefined
  return result.status === 'error' ? result.previousSeries : result.series
}

function getWeather(result: ReturnType<typeof useCurrentWeather>['result']) {
  if (!result) return undefined
  if (result.status === 'error') return result.previousWeather
  if (result.status === 'empty') return undefined
  return result.weather
}

export function OverviewPage() {
  const [selectedUtility, setSelectedUtility] = useState<UtilityId>('electricity')
  const [selectedPeriod, setSelectedPeriod] = useState<ProductPeriod>('24h')
  const summaries = useUtilitySummaries('24h')
  const selected = useUtilitySeries(selectedUtility, selectedPeriod)
  const weatherState = useCurrentWeather()
  const selectedSeries = getSeries(selected.result)
  const weather = getWeather(weatherState.result)
  const metrics = getSeriesMetrics(selectedSeries)
  const selectedDefinition = utilityDefinitions.find((definition) => definition.id === selectedUtility)

  return (
    <main className="page page--overview" data-layout="overview">
      <section className="overview-hero">
        <article className="panel hero-panel">
          <MediaSlot asset={mediaAssets.overviewHeroMedia} slotName="overviewHeroMedia" />
          <div>
            <span className="eyebrow">Overview</span>
            <h1>Oodi</h1>
            <p>{oodiConfig.address}</p>
            <p>
              Executive summary of public utility data, current weather context,
              and clearly labelled conceptual intelligence.
            </p>
            <div className="classification-row">
              <ClassificationBadge kind="public-utility" label={classificationLabels['public-utility'].label} />
              <ClassificationBadge kind="current-weather" label={classificationLabels['current-weather'].label} />
              <ClassificationBadge kind="conceptual" label={classificationLabels.conceptual.label} />
            </div>
          </div>
        </article>

        <article className="panel building-context">
          <span className="eyebrow">Building Context</span>
          <h2>{oodiConfig.publicName}</h2>
          <p>Helsinki, Finland · Public library · {oodiConfig.nuuka.buildingType}</p>
          <DataStatus
            state={
              weatherState.loading ? { status: 'loading' } :
              weatherState.result?.status === 'error' ? { status: 'error', message: weatherState.result.error.message, retryable: weatherState.result.error.retryable } :
              weatherState.result?.status === 'empty' ? { status: 'empty', message: weatherState.result.message } :
              weatherState.result?.status === 'partial' ? { status: 'partial', data: weather, message: weatherState.result.message } :
              { status: 'success', data: weather }
            }
          />
          <div className="weather-summary">
            <strong>{weather ? `${weather.current.temperatureC.toFixed(1)} C` : 'n/a'}</strong>
            <span>{weather?.current.condition.label ?? 'Weather context unavailable'}</span>
            <span>Source timestamp: {weather?.current.sourceTimestamp ?? 'n/a'}</span>
            <span>Provider: Open-Meteo</span>
          </div>
          <p className="meta">Utility datasets update independently of weather data.</p>
        </article>
      </section>

      <section className="utility-grid" aria-label="Utility summaries">
        {utilityDefinitions.map((definition) => (
          <button
            className="utility-grid__button"
            data-control="utility-summary"
            data-utility={definition.id}
            key={definition.id}
            onClick={() => setSelectedUtility(definition.id)}
            type="button"
          >
            <UtilitySummaryCard
              definition={definition}
              loading={summaries[definition.id].loading}
              result={summaries[definition.id].result}
              selected={selectedUtility === definition.id}
            />
          </button>
        ))}
      </section>

      <section className="overview-main-grid">
        <article className="panel performance-summary">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Resource Performance</span>
              <h2>{selectedDefinition?.displayName ?? 'Utility'} summary</h2>
            </div>
            <select
              data-control="period-selector"
              value={selectedPeriod}
              onChange={(event) => setSelectedPeriod(event.target.value as ProductPeriod)}
            >
              {periodOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <MiniChart path={getChartPath(selectedSeries)} utility={selectedUtility} />
          <div className="metric-grid">
            <MetricCard utility={selectedUtility} label="Average" value={formatMetricValue(metrics.average, selectedSeries?.unit ?? '')} detail={getPeriodLabel(selectedPeriod)} />
            <MetricCard utility={selectedUtility} label="Peak" value={formatMetricValue(metrics.peak?.value, selectedSeries?.unit ?? '')} detail={metrics.peak?.timestamp ?? 'n/a'} />
            <MetricCard utility={selectedUtility} label="Latest" value={formatMetricValue(metrics.latest?.value, selectedSeries?.unit ?? '')} detail={metrics.latest?.timestamp ?? 'n/a'} />
          </div>
          <dl className="metadata-grid">
            <div><dt>Requested period</dt><dd>{selectedSeries?.period.requestedPeriod ?? selectedPeriod}</dd></div>
            <div><dt>Effective period</dt><dd>{selectedSeries?.period.effectiveWindow ? `${selectedSeries.period.effectiveWindow.start} to ${selectedSeries.period.effectiveWindow.end}` : 'n/a'}</dd></div>
            <div><dt>Source timestamp</dt><dd>{selectedSeries?.latestReading?.sourceTimestamp ?? 'n/a'}</dd></div>
          </dl>
        </article>

        <article className="panel insights-panel">
          <span className="eyebrow">Insights</span>
          <h2>Readable observations</h2>
          {cautiousInsights.map((insight, index) => (
            <InsightCard
              emphasis={index === 0 ? 'highlight' : 'normal'}
              key={insight}
              title={index === 0 ? 'Data freshness' : `Context note ${index + 1}`}
            >
              {insight}
            </InsightCard>
          ))}
        </article>
      </section>

      <section className="overview-main-grid">
        <article className="panel intelligence-panel">
          <span className="eyebrow">Conceptual IoT Layer</span>
          <h2>Building Intelligence</h2>
          <div className="concept-grid">
            {conceptualModules.map((module) => (
              <article key={module.title}>
                <strong>{module.title}</strong>
                <ClassificationBadge kind="conceptual" label="Conceptual" />
                <p>{module.status}</p>
              </article>
            ))}
          </div>
        </article>
        <article className="panel transparency-panel">
          <span className="eyebrow">Data Transparency</span>
          <h2>Sources and classifications</h2>
          <TransparencyRow kind="public-utility" title="Public Utility Data" source="Nuuka Open API" status="Per-utility timestamps" />
          <TransparencyRow kind="current-weather" title="Current Public Weather" source="Open-Meteo" status="Provider timestamp" />
          <TransparencyRow kind="conceptual" title="Conceptual Data" source="Local prototype content" status="Illustrative" />
          <a className="text-link" href="#/data-transparency">Explore methodology</a>
        </article>
      </section>
    </main>
  )
}

function MiniChart({ path, utility }: { path: string; utility: UtilityId }) {
  return (
    <figure className="chart-shell" data-utility={utility} aria-label="Structural utility chart summary">
      <svg viewBox="0 0 100 48" role="img" aria-label="Selected utility trend line">
        <path d={path} />
      </svg>
      <figcaption>Selected-period structure · Stage 6 calculations not introduced.</figcaption>
    </figure>
  )
}
