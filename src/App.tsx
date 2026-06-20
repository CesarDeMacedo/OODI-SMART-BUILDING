import { useEffect, useState } from 'react'
import './App.css'
import { utilityDefinitions } from './data/utilities/utilityDefinitions'
import { utilityRepository } from './data/utilities/utilityRepository'
import type { UtilitySeriesResult } from './data/utilities/utilitySeries'

type VerificationState = {
  loading: boolean
  results: UtilitySeriesResult[]
}

function App() {
  const [state, setState] = useState<VerificationState>({
    loading: true,
    results: [],
  })

  useEffect(() => {
    let ignore = false

    async function loadSeries() {
      const results = await Promise.all(
        utilityDefinitions.map((utility) =>
          utilityRepository.getSeries({
            utility: utility.id,
            period: '30d',
          }),
        ),
      )

      if (!ignore) {
        setState({ loading: false, results })
      }
    }

    loadSeries().catch((error) => {
      console.error(error)
      if (!ignore) {
        setState({ loading: false, results: [] })
      }
    })

    return () => {
      ignore = true
    }
  }, [])

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
        <h2>Repository Results</h2>
        {state.loading ? <p>Loading latest available Nuuka utility series...</p> : null}
        <ul className="groups">
          {state.results.map((result) => {
            const series = result.status === 'error' ? result.previousSeries : result.series
            return (
              <li key={series?.utility ?? result.status}>
                <span>{series?.displayName ?? 'Utility'}</span>
                <strong>{result.status}</strong>
                <small>
                  Latest: {series?.latestReading?.sourceTimestamp ?? 'n/a'}
                  <br />
                  Points: {series?.points.length ?? 0}
                  <br />
                  Origin: {series?.provenance.origin ?? 'n/a'}
                </small>
              </li>
            )
          })}
        </ul>
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
