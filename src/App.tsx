import { useEffect, useState } from 'react'
import './App.css'
import { weatherRepository } from './data/weather/weatherRepository'
import { utilityDefinitions } from './data/utilities/utilityDefinitions'
import { utilityRepository } from './data/utilities/utilityRepository'
import type { ProductPeriod, UtilityId, UtilitySeriesResult } from './data/utilities/utilitySeries'
import type { WeatherResult } from './data/weather/weatherTypes'

type VerificationState = {
  loading: boolean
  result: UtilitySeriesResult | null
}

type WeatherVerificationState = {
  loading: boolean
  result: WeatherResult | null
}

const periodOptions = [
  { value: '24h', label: '24 Hours' },
  { value: '30d', label: '30 Days' },
  { value: '12m', label: '12 Months' },
] as const

function formatWindow(window: { start: string; end: string } | null | undefined) {
  return window ? `${window.start} to ${window.end}` : 'n/a'
}

function getResultTone(result: UtilitySeriesResult | null) {
  if (!result) return 'Waiting'
  if (result.status === 'error') return result.error.code

  const series = result.series
  if (series.provenance.origin === 'snapshot') return 'snapshot success'
  if (series.period.isFallback) return 'partial/fallback success'
  if (result.status === 'empty') return 'empty'
  if (series.qualityNotices.some((notice) => notice.code === 'PARTIAL_WINDOW')) {
    return 'partial success'
  }

  return 'success'
}

function getWeatherResultTone(result: WeatherResult | null) {
  if (!result) return 'Waiting'
  if (result.status === 'error') return result.error.code
  if (result.status === 'empty') return 'empty'
  if (result.weather.provider.origin === 'memory-cache') return 'memory-cache'
  return result.status
}

function formatWeatherRange(points: Array<{ timestamp?: string; date?: string }>) {
  if (points.length === 0) return 'n/a'

  const first = points[0].timestamp ?? points[0].date ?? 'n/a'
  const last = points[points.length - 1].timestamp ?? points[points.length - 1].date ?? 'n/a'
  return `${first} to ${last}`
}

function getWeatherPackage(result: WeatherResult | null) {
  if (!result) return undefined
  if (result.status === 'error') return result.previousWeather
  if (result.status === 'empty') return undefined

  return result.weather
}

function App() {
  const [utility, setUtility] = useState<UtilityId>('electricity')
  const [period, setPeriod] = useState<ProductPeriod>('24h')
  const [state, setState] = useState<VerificationState>({
    loading: true,
    result: null,
  })
  const [weatherState, setWeatherState] = useState<WeatherVerificationState>({
    loading: true,
    result: null,
  })

  useEffect(() => {
    let ignore = false

    async function loadSeries(refresh: 'default' | 'force' = 'default') {
      setState((current) => ({ ...current, loading: true }))
      const result = await utilityRepository.getSeries({
        utility,
        period,
        refresh,
      })

      if (!ignore) {
        setState({ loading: false, result })
      }
    }

    loadSeries().catch((error) => {
      console.error(error)
      if (!ignore) {
        setState({
          loading: false,
          result: {
            status: 'error',
            error: {
              code: 'UNKNOWN',
              message: 'Unexpected verification view error.',
              retryable: false,
              cause: error,
            },
          },
        })
      }
    })

    return () => {
      ignore = true
    }
  }, [period, utility])

  useEffect(() => {
    let ignore = false

    async function loadWeather(refresh: 'default' | 'force' = 'default') {
      setWeatherState((current) => ({ ...current, loading: true }))
      const result = await weatherRepository.getWeather({ refresh })

      if (!ignore) {
        setWeatherState({ loading: false, result })
      }
    }

    loadWeather().catch((error) => {
      console.error(error)
      if (!ignore) {
        setWeatherState({
          loading: false,
          result: {
            status: 'error',
            error: {
              code: 'UNKNOWN',
              message: 'Unexpected weather verification view error.',
              retryable: false,
              cause: error,
            },
          },
        })
      }
    })

    return () => {
      ignore = true
    }
  }, [])

  const result = state.result
  const series = result?.status === 'error' ? result.previousSeries : result?.series
  const qualityNotices = series?.qualityNotices ?? []
  const weatherResult = weatherState.result
  const weather = getWeatherPackage(weatherResult)
  const weatherNotices = weather?.qualityNotices ?? []

  return (
    <main className="page">
      <section className="header">
        <p className="eyebrow">Stage 2 developer verification</p>
        <h1>Oodi Smart Building Data Foundation</h1>
        <p>
          Minimal verification view for the Nuuka data repository contract and
          Stage 3 weather repository contract. This is not the final dashboard
          and does not include charts, insights, utility-weather correlation, or
          conceptual IoT.
        </p>
      </section>

      <section className="panel">
        <h2>Repository Controls</h2>
        <div className="controls">
          <label>
            Utility
            <select value={utility} onChange={(event) => setUtility(event.target.value as UtilityId)}>
              {utilityDefinitions.map((definition) => (
                <option key={definition.id} value={definition.id}>
                  {definition.displayName}
                </option>
              ))}
            </select>
          </label>
          <label>
            Period
            <select value={period} onChange={(event) => setPeriod(event.target.value as ProductPeriod)}>
              {periodOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => {
              setState((current) => ({ ...current, loading: true }))
              utilityRepository
                .getSeries({ utility, period, refresh: 'force' })
                .then((nextResult) => setState({ loading: false, result: nextResult }))
                .catch((error) => {
                  console.error(error)
                  setState({
                    loading: false,
                    result: {
                      status: 'error',
                      error: {
                        code: 'UNKNOWN',
                        message: 'Unexpected force-refresh verification error.',
                        retryable: false,
                      },
                    },
                  })
                })
            }}
          >
            Force refresh
          </button>
        </div>
        {state.loading ? <p className="state">Loading latest available Nuuka utility series...</p> : null}
      </section>

      <section className="panel">
        <h2>Repository Result</h2>
        <p className="state">State: {getResultTone(result)}</p>
        {series?.provenance.origin === 'snapshot' ? (
          <div className="notice">
            <strong>Cached Public Data Snapshot</strong>
            <p>
              The public data service is currently unavailable. This view uses a previously
              retrieved Nuuka dataset and displays its original source timestamps.
            </p>
          </div>
        ) : null}
        {series?.provenance.origin === 'memory-cache' ? (
          <div className="notice">
            <strong>Session cache result</strong>
            <p>This result was reused from the in-memory session cache, not newly retrieved.</p>
          </div>
        ) : null}
        {result?.status === 'empty' ? <p className="empty">{result.message}</p> : null}
        {result?.status === 'error' ? (
          <div className="error">
            <strong>{result.error.code}</strong>
            <p>{result.error.message}</p>
          </div>
        ) : null}
        <dl className="metadata">
          <div>
            <dt>Utility</dt>
            <dd>{series?.displayName ?? 'n/a'}</dd>
          </div>
          <div>
            <dt>Result status</dt>
            <dd>{result?.status ?? 'n/a'}</dd>
          </div>
          <div>
            <dt>Unit</dt>
            <dd>{series?.unit ?? 'n/a'}</dd>
          </div>
          <div>
            <dt>Requested period</dt>
            <dd>{series?.period.requestedPeriod ?? period}</dd>
          </div>
          <div>
            <dt>Requested window</dt>
            <dd>{formatWindow(series?.period.requestedWindow)}</dd>
          </div>
          <div>
            <dt>Effective window</dt>
            <dd>{formatWindow(series?.period.effectiveWindow)}</dd>
          </div>
          <div>
            <dt>Requested granularity</dt>
            <dd>{series?.period.requestedGranularity ?? 'n/a'}</dd>
          </div>
          <div>
            <dt>Effective granularity</dt>
            <dd>{series?.period.effectiveGranularity ?? 'n/a'}</dd>
          </div>
          <div>
            <dt>Latest reading</dt>
            <dd>{series?.latestReading?.value ?? 'n/a'}</dd>
          </div>
          <div>
            <dt>Latest source timestamp</dt>
            <dd>{series?.latestReading?.sourceTimestamp ?? 'n/a'}</dd>
          </div>
          <div>
            <dt>Point count</dt>
            <dd>{series?.points.length ?? 0}</dd>
          </div>
          <div>
            <dt>Origin</dt>
            <dd>{series?.provenance.origin ?? 'n/a'}</dd>
          </div>
          <div>
            <dt>Fallback state</dt>
            <dd>{series ? String(series.period.isFallback) : 'n/a'}</dd>
          </div>
          <div>
            <dt>Fallback reason</dt>
            <dd>{series?.period.fallbackReason ?? 'n/a'}</dd>
          </div>
          <div>
            <dt>Quality notices</dt>
            <dd>{qualityNotices.length > 0 ? qualityNotices.map((notice) => notice.code).join(', ') : 'none'}</dd>
          </div>
          <div>
            <dt>Retrieval timestamp</dt>
            <dd>{series?.provenance.retrievedAt ?? 'n/a'}</dd>
          </div>
          <div>
            <dt>Snapshot generated timestamp</dt>
            <dd>{series?.provenance.snapshotGeneratedAt ?? 'n/a'}</dd>
          </div>
          <div>
            <dt>Error code</dt>
            <dd>{result?.status === 'error' ? result.error.code : 'n/a'}</dd>
          </div>
          <div>
            <dt>Error message</dt>
            <dd>{result?.status === 'error' ? result.error.message : 'n/a'}</dd>
          </div>
        </dl>
      </section>

      <section className="panel">
        <h2>Technical Honesty</h2>
        <p>
          Nuuka values are real public building data and are shown as latest
          available readings, not live operational data. Each utility retains its
          own timestamp and effective period.
        </p>
      </section>

      <section className="panel">
        <p className="eyebrow">Stage 3 developer verification</p>
        <h2>Current Weather Repository Result</h2>
        <p className="meta">
          Current public weather data from Open-Meteo for Oodi coordinates. This
          weather context is model-derived provider data, not a measurement at
          Oodi and not final dashboard design.
        </p>
        <div className="controls">
          <button
            type="button"
            onClick={() => {
              setWeatherState((current) => ({ ...current, loading: true }))
              weatherRepository
                .getWeather({ refresh: 'force' })
                .then((nextResult) => setWeatherState({ loading: false, result: nextResult }))
                .catch((error) => {
                  console.error(error)
                  setWeatherState({
                    loading: false,
                    result: {
                      status: 'error',
                      error: {
                        code: 'UNKNOWN',
                        message: 'Unexpected weather force-refresh verification error.',
                        retryable: false,
                      },
                    },
                  })
                })
            }}
          >
            Force refresh weather
          </button>
        </div>
        {weatherState.loading ? (
          <p className="state">Loading latest available Open-Meteo weather context...</p>
        ) : null}
        <p className="state">State: {getWeatherResultTone(weatherResult)}</p>
        {weather?.provider.origin === 'memory-cache' ? (
          <div className="notice">
            <strong>Session cache result</strong>
            <p>This weather result was reused from the in-memory session cache, not newly retrieved.</p>
          </div>
        ) : null}
        {weatherResult?.status === 'partial' ? (
          <div className="notice">
            <strong>Partial weather coverage</strong>
            <p>{weatherResult.message}</p>
          </div>
        ) : null}
        {weatherResult?.status === 'empty' ? <p className="empty">{weatherResult.message}</p> : null}
        {weatherResult?.status === 'error' ? (
          <div className="error">
            <strong>{weatherResult.error.code}</strong>
            <p>{weatherResult.error.message}</p>
            {weatherResult.previousWeather ? (
              <p>Previous weather remains visible below for verification continuity.</p>
            ) : null}
          </div>
        ) : null}
        <dl className="metadata">
          <div>
            <dt>Classification</dt>
            <dd>{weather?.classification ?? 'n/a'}</dd>
          </div>
          <div>
            <dt>Provider</dt>
            <dd>{weather?.provider.provider ?? 'n/a'}</dd>
          </div>
          <div>
            <dt>Origin</dt>
            <dd>{weather?.provider.origin ?? 'n/a'}</dd>
          </div>
          <div>
            <dt>Application retrieval timestamp</dt>
            <dd>{weather?.provider.retrievedAt ?? 'n/a'}</dd>
          </div>
          <div>
            <dt>Current weather source timestamp</dt>
            <dd>{weather?.current.sourceTimestamp ?? 'n/a'}</dd>
          </div>
          <div>
            <dt>Normalized current timestamp</dt>
            <dd>{weather?.current.timestamp ?? 'n/a'}</dd>
          </div>
          <div>
            <dt>Temperature</dt>
            <dd>{weather ? `${weather.current.temperatureC} C` : 'n/a'}</dd>
          </div>
          <div>
            <dt>Apparent temperature</dt>
            <dd>{weather ? `${weather.current.apparentTemperatureC} C` : 'n/a'}</dd>
          </div>
          <div>
            <dt>Humidity</dt>
            <dd>{weather ? `${weather.current.relativeHumidityPercent}%` : 'n/a'}</dd>
          </div>
          <div>
            <dt>Precipitation</dt>
            <dd>{weather ? `${weather.current.precipitationMm} mm` : 'n/a'}</dd>
          </div>
          <div>
            <dt>Weather code</dt>
            <dd>{weather?.current.weatherCode ?? 'n/a'}</dd>
          </div>
          <div>
            <dt>Condition</dt>
            <dd>{weather?.current.condition.label ?? 'n/a'}</dd>
          </div>
          <div>
            <dt>Cloud cover</dt>
            <dd>{weather ? `${weather.current.cloudCoverPercent}%` : 'n/a'}</dd>
          </div>
          <div>
            <dt>Wind</dt>
            <dd>
              {weather
                ? `${weather.current.windSpeedKmh} km/h, ${weather.current.windDirectionDegrees} deg, gust ${weather.current.windGustKmh} km/h`
                : 'n/a'}
            </dd>
          </div>
          <div>
            <dt>Daylight flag</dt>
            <dd>{weather ? String(weather.current.isDay) : 'n/a'}</dd>
          </div>
          <div>
            <dt>Hourly forecast count</dt>
            <dd>{weather?.hourly.length ?? 0}</dd>
          </div>
          <div>
            <dt>Hourly forecast window</dt>
            <dd>{formatWeatherRange(weather?.hourly ?? [])}</dd>
          </div>
          <div>
            <dt>Daily forecast count</dt>
            <dd>{weather?.daily.length ?? 0}</dd>
          </div>
          <div>
            <dt>Daily forecast window</dt>
            <dd>{formatWeatherRange(weather?.daily ?? [])}</dd>
          </div>
          <div>
            <dt>Requested coordinates</dt>
            <dd>
              {weather
                ? `${weather.provider.requestedLatitude}, ${weather.provider.requestedLongitude}`
                : 'n/a'}
            </dd>
          </div>
          <div>
            <dt>Response coordinates</dt>
            <dd>
              {weather
                ? `${weather.provider.responseLatitude}, ${weather.provider.responseLongitude}`
                : 'n/a'}
            </dd>
          </div>
          <div>
            <dt>Timezone</dt>
            <dd>{weather?.provider.timezone ?? 'n/a'}</dd>
          </div>
          <div>
            <dt>Timezone abbreviation</dt>
            <dd>{weather?.provider.timezoneAbbreviation ?? 'n/a'}</dd>
          </div>
          <div>
            <dt>UTC offset seconds</dt>
            <dd>{weather?.provider.utcOffsetSeconds ?? 'n/a'}</dd>
          </div>
          <div>
            <dt>Provider processing duration</dt>
            <dd>{weather?.provider.generationTimeMs ?? 'n/a'} ms</dd>
          </div>
          <div>
            <dt>Quality notices</dt>
            <dd>{weatherNotices.length > 0 ? weatherNotices.map((notice) => notice.code).join(', ') : 'none'}</dd>
          </div>
          <div>
            <dt>Error code</dt>
            <dd>{weatherResult?.status === 'error' ? weatherResult.error.code : 'n/a'}</dd>
          </div>
          <div>
            <dt>Error message</dt>
            <dd>{weatherResult?.status === 'error' ? weatherResult.error.message : 'n/a'}</dd>
          </div>
          <div>
            <dt>Attribution</dt>
            <dd>
              {weather ? (
                <a href={weather.provider.attributionUrl} rel="noreferrer" target="_blank">
                  {weather.provider.attributionLabel}
                </a>
              ) : (
                'n/a'
              )}
            </dd>
          </div>
        </dl>
      </section>
    </main>
  )
}

export default App
