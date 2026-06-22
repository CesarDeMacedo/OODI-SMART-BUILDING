import { EntryActionCard } from '../../components/cards/EntryActionCard'
import { MediaSlot } from '../../components/layout/MediaSlot'
import { mediaAssets } from '../../content/mediaAssets'
import { useCurrentWeather } from '../useAppData'

function getWeather(result: ReturnType<typeof useCurrentWeather>['result']) {
  if (!result) return undefined
  if (result.status === 'error') return result.previousWeather
  if (result.status === 'empty') return undefined
  return result.weather
}

export function OpeningPage() {
  const weatherState = useCurrentWeather()
  const weather = getWeather(weatherState.result)
  const weatherStatus =
    weatherState.loading ? 'Loading current weather context' :
    weather ? `${weather.current.temperatureC.toFixed(1)} C · ${weather.current.condition.label}` :
    'Current weather context unavailable'

  return (
    <main className="page page--opening" data-layout="opening">
      <section className="opening-hero">
        <MediaSlot
          asset={mediaAssets.openingHeroMedia}
          className="opening-hero__media"
          slotName="openingHeroMedia"
        />
        <div className="opening-hero__copy">
          <h1>
            <span>OODI</span>
            <span>Smart Building Intelligence</span>
          </h1>
          <span className="opening-hero__accent" aria-hidden="true" />
          <p className="opening-hero__lead">
            A responsive intelligence layer for Oodi, Helsinki&apos;s iconic public library.
          </p>
          <p>
            This independent prototype explores how public data and smart analytics can support
            a more sustainable, comfortable, and efficient building.
          </p>
        </div>

        <div className="entry-grid opening-hero__actions" aria-label="Primary entry actions">
          <EntryActionCard cta="primary" href="#/overview" title="Enter Overview" description="Explore Oodi at a glance" />
          <EntryActionCard
            cta="secondary"
            href="#/resource-performance"
            title="Explore Resource Performance"
            description="Track energy, water, and emissions"
          />
          <EntryActionCard
            cta="tertiary"
            href="#/data-transparency"
            title="View Methodology"
            description="Understand data sources and approach"
          />
        </div>
      </section>

      <section className="summary-band">
        <article className="summary-band__item">
          <strong>Public utility data</strong>
          <p>Nuuka public sources for electricity, heat, water, and cooling.</p>
        </article>
        <article className="summary-band__item summary-band__weather" data-classification="current-weather">
          <div>
            <strong>Current public weather context</strong>
            <p>{weatherStatus}</p>
            <p>Helsinki, Finland · Provider: Open-Meteo</p>
          </div>
          <dl aria-label="Weather metadata">
            <div>
              <dt>Observed</dt>
              <dd>{weather?.current.sourceTimestamp ?? 'Pending'}</dd>
            </div>
            <div>
              <dt>Wind</dt>
              <dd>{weather ? `${weather.current.windSpeedKmh.toFixed(0)} km/h` : 'n/a'}</dd>
            </div>
            <div>
              <dt>Humidity</dt>
              <dd>{weather ? `${weather.current.relativeHumidityPercent.toFixed(0)}%` : 'n/a'}</dd>
            </div>
          </dl>
        </article>
        <article className="summary-band__item">
          <strong>Conceptual IoT integration</strong>
          <p>Illustrative intelligence modules, not live building systems.</p>
        </article>
      </section>
    </main>
  )
}
