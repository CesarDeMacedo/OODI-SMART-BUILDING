import { useEffect, useState } from 'react'
import './App.css'
import { utilityDefinitions } from './data/utilities/utilityDefinitions'
import { utilityRepository } from './data/utilities/utilityRepository'
import type { ProductPeriod, UtilityId, UtilitySeriesResult } from './data/utilities/utilitySeries'

type VerificationState = {
  loading: boolean
  result: UtilitySeriesResult | null
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

function App() {
  const [utility, setUtility] = useState<UtilityId>('electricity')
  const [period, setPeriod] = useState<ProductPeriod>('24h')
  const [state, setState] = useState<VerificationState>({
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

  const result = state.result
  const series = result?.status === 'error' ? result.previousSeries : result?.series
  const qualityNotices = series?.qualityNotices ?? []

  return (
    <main className="page">
      <section className="header">
        <p className="eyebrow">Stage 2 developer verification</p>
        <h1>Oodi Smart Building Data Foundation</h1>
        <p>
          Minimal verification view for the Nuuka data repository contract. This
          is not the final dashboard and does not include weather, charts,
          insights, or conceptual IoT.
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
    </main>
  )
}

export default App
