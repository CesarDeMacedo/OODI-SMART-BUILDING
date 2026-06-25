import { useCurrentWeather, useUtilitySummaries } from '../useAppData'
import type { UtilityLoadState } from '../useAppData'
import { ClassificationBadge, DataStatus } from '../../components/layout/DataStatus'
import type { ModuleState } from '../../components/layout/DataStatus'
import { DisclosureBar } from '../../components/layout/DisclosureBar'
import { TransparencyRow } from '../../components/cards/TransparencyRow'
import { classificationLabels, prototypeDisclaimer } from '../../content/pageContent'
import type { UtilitySeries } from '../../data/utilities/utilitySeries'

function moduleStateFromLoad(state: UtilityLoadState): ModuleState<UtilitySeries> {
  if (state.loading) return { status: 'loading' }
  const r = state.result
  if (!r) return { status: 'loading' }
  if (r.status === 'error')
    return { status: 'error', message: r.error.message, retryable: r.error.retryable }
  if (r.status === 'empty') return { status: 'empty', message: r.message }
  const s = r.series
  if (s.provenance.origin === 'snapshot')
    return { status: 'cached-public-snapshot', message: 'Cached public snapshot' }
  if (s.provenance.origin === 'memory-cache')
    return { status: 'memory-cache', message: 'Memory cache' }
  if (s.period.isFallback)
    return { status: 'partial', data: s, message: 'Latest available period' }
  return { status: 'success', data: s }
}

export function DataTransparencyPage() {
  const utilities = useUtilitySummaries('30d')
  const { loading: weatherLoading, result: weatherResult } = useCurrentWeather()

  const weatherModuleState = (): ModuleState<never> => {
    if (weatherLoading) return { status: 'loading' }
    if (!weatherResult) return { status: 'loading' }
    if (weatherResult.status === 'error')
      return { status: 'error', message: weatherResult.error.message, retryable: weatherResult.error.retryable }
    if (weatherResult.status === 'empty')
      return { status: 'empty', message: weatherResult.message }
    return { status: 'success', data: undefined as never }
  }

  return (
    <main className="page page--data-transparency" data-layout="data-transparency">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="dt-header">
        <span className="eyebrow">Data Transparency</span>
        <h1>Sources, methodology and limitations</h1>
        <p>
          This page explains what is real public data, what is current public weather context,
          and what is conceptual prototype content. The project is an independent portfolio
          prototype — not an operational Oodi system.
        </p>
        <p className="dt-header__disclaimer">{prototypeDisclaimer}</p>
        <div className="dt-header__badges">
          {Object.entries(classificationLabels).map(([kind, detail]) => (
            <ClassificationBadge
              key={kind}
              kind={kind as keyof typeof classificationLabels}
              label={detail.label}
            />
          ))}
        </div>
      </div>

      {/* ── Section A: Data Sources ──────────────────────────────────────────── */}
      <section className="dt-section" aria-labelledby="dt-sources-heading">
        <div className="dt-section__heading">
          <h2 id="dt-sources-heading">Data Sources</h2>
        </div>
        <div className="dt-sources-grid">

          {/* Public Building Data */}
          <div className="panel dt-source-block">
            <div className="dt-source-block__header">
              <ClassificationBadge kind="public-utility" label={classificationLabels['public-utility'].label} />
            </div>
            <dl>
              <div>
                <dt>Source</dt>
                <dd>Helsinki Nuuka Open API</dd>
              </div>
              <div>
                <dt>Includes</dt>
                <dd>Electricity, Heat, Water, District Cooling</dd>
              </div>
              <div>
                <dt>Units</dt>
                <dd>kWh (energy) · m³ (water)</dd>
              </div>
              <div>
                <dt>Granularity</dt>
                <dd>Hourly, daily, monthly depending on period</dd>
              </div>
              <div>
                <dt>Update frequency</dt>
                <dd>Each utility updates independently — timestamps are not synchronised</dd>
              </div>
            </dl>
          </div>

          {/* Current Weather */}
          <div className="panel dt-source-block">
            <div className="dt-source-block__header">
              <ClassificationBadge kind="current-weather" label={classificationLabels['current-weather'].label} />
            </div>
            <dl>
              <div>
                <dt>Source</dt>
                <dd>Open-Meteo forecast API</dd>
              </div>
              <div>
                <dt>Location</dt>
                <dd>Oodi Helsinki coordinates (60.173°N, 24.939°E)</dd>
              </div>
              <div>
                <dt>Type</dt>
                <dd>Model-based weather context — not an Oodi rooftop sensor</dd>
              </div>
              <div>
                <dt>Independence</dt>
                <dd>Weather timestamp is independent of all utility timestamps</dd>
              </div>
            </dl>
          </div>

          {/* Conceptual IoT */}
          <div className="panel dt-source-block">
            <div className="dt-source-block__header">
              <ClassificationBadge kind="conceptual" label={classificationLabels.conceptual.label} />
            </div>
            <dl>
              <div>
                <dt>Source</dt>
                <dd>Deterministic local prototype dataset</dd>
              </div>
              <div>
                <dt>Includes</dt>
                <dd>Occupancy, Indoor Comfort, Air Quality, HVAC, Asset Health</dd>
              </div>
              <div>
                <dt>Connection</dt>
                <dd>Not connected to real sensors, BMS, or operational systems</dd>
              </div>
              <div>
                <dt>Control</dt>
                <dd>No live control capability — illustrative only</dd>
              </div>
            </dl>
          </div>

        </div>
      </section>

      {/* ── Section B: Live Source Status ────────────────────────────────────── */}
      <section className="dt-section" aria-labelledby="dt-status-heading">
        <div className="dt-section__heading">
          <h2 id="dt-status-heading">Current Source Status</h2>
        </div>
        <div className="panel dt-status-panel">
          <div className="dt-status-row">
            <div className="dt-status-row__info">
              <TransparencyRow
                kind="public-utility"
                title="Electricity"
                source="Helsinki Nuuka Open API"
                status="Public building data"
              />
            </div>
            <DataStatus state={moduleStateFromLoad(utilities.electricity)} />
          </div>
          <div className="dt-status-row">
            <div className="dt-status-row__info">
              <TransparencyRow
                kind="public-utility"
                title="Heat"
                source="Helsinki Nuuka Open API"
                status="Public building data"
              />
            </div>
            <DataStatus state={moduleStateFromLoad(utilities.heat)} />
          </div>
          <div className="dt-status-row">
            <div className="dt-status-row__info">
              <TransparencyRow
                kind="public-utility"
                title="Water"
                source="Helsinki Nuuka Open API"
                status="Public building data"
              />
            </div>
            <DataStatus state={moduleStateFromLoad(utilities.water)} />
          </div>
          <div className="dt-status-row">
            <div className="dt-status-row__info">
              <TransparencyRow
                kind="public-utility"
                title="District Cooling"
                source="Helsinki Nuuka Open API"
                status="Public building data"
              />
            </div>
            <DataStatus state={moduleStateFromLoad(utilities.districtCooling)} />
          </div>
          <div className="dt-status-row">
            <div className="dt-status-row__info">
              <TransparencyRow
                kind="current-weather"
                title="Open-Meteo weather"
                source="Open-Meteo forecast API"
                status="Current public weather data"
              />
            </div>
            <DataStatus state={weatherModuleState()} />
          </div>
          <div className="dt-status-row">
            <div className="dt-status-row__info">
              <TransparencyRow
                kind="conceptual"
                title="Building Intelligence"
                source="Local prototype content"
                status="Illustrative only"
              />
            </div>
            <DataStatus state={{ status: 'conceptual', message: 'Conceptual IoT layer' }} />
          </div>
        </div>
      </section>

      {/* ── Section C: Methodology ───────────────────────────────────────────── */}
      <section className="dt-section" aria-labelledby="dt-method-heading">
        <div className="dt-section__heading">
          <h2 id="dt-method-heading">Methodology</h2>
        </div>
        <div className="panel dt-prose" style={{ padding: 'var(--space-5)' }}>
          <ul>
            <li>
              <strong>Requested vs. effective period:</strong> The application requests a specific
              time window (e.g. 30 days). If the source returns no data for that exact window,
              the system uses the nearest available window rather than fabricating values.
              The effective period is always labelled when it differs from the request.
            </li>
            <li>
              <strong>Independent utility timestamps:</strong> Each utility (Electricity, Heat,
              Water, District Cooling) has its own source timestamp. These are not synchronised.
              A reading dated two days ago for electricity does not imply the same date for heat.
            </li>
            <li>
              <strong>Granularity fallback:</strong> If hourly data is empty for a 24-hour window,
              the system may use daily data for the same period. The effective granularity is
              always shown alongside the data.
            </li>
            <li>
              <strong>No interpolation:</strong> Values are returned as-is from the API or
              snapshot. No gap-filling, smoothing, or extrapolation is performed.
            </li>
            <li>
              <strong>Snapshot authenticity:</strong> When a cached public snapshot is used
              as fallback, it contains authentic Nuuka data retrieved at a prior point in time —
              not synthesised values.
            </li>
            <li>
              <strong>Weather independence:</strong> Open-Meteo data is retrieved independently.
              Its timestamp is separate from all utility data timestamps and should not be
              interpreted as simultaneous with utility readings.
            </li>
            <li>
              <strong>Conceptual IoT:</strong> All 45 Building Intelligence zone records are
              deterministic prototype content. Values are fixed in code and do not change
              between sessions.
            </li>
          </ul>
        </div>
      </section>

      {/* ── Section D: Project Limitations ───────────────────────────────────── */}
      <section className="dt-section" aria-labelledby="dt-limits-heading">
        <div className="dt-section__heading">
          <h2 id="dt-limits-heading">Project Limitations</h2>
        </div>
        <ul className="dt-limitations-list panel" style={{ padding: 'var(--space-5)' }}>
          <li>Independent portfolio prototype — not affiliated with Oodi, the City of Helsinki, Nuuka, Open-Meteo, or WSP.</li>
          <li>Not an operational digital twin or building management system.</li>
          <li>No BMS connection. No building system controls.</li>
          <li>No real occupancy tracking. Building Intelligence data is illustrative.</li>
          <li>No predictive maintenance capabilities. Asset health data is conceptual.</li>
          <li>No production security or authentication layer.</li>
          <li>Weather data is model-based (Open-Meteo) for Oodi&apos;s coordinates — not a physical rooftop sensor.</li>
          <li>Utility data is sourced from the public Helsinki Nuuka API and may be delayed by one or more days.</li>
        </ul>
      </section>

      {/* ── Section E: Image and Asset Credits ───────────────────────────────── */}
      <section className="dt-section" aria-labelledby="dt-credits-heading">
        <div className="dt-section__heading">
          <h2 id="dt-credits-heading">Image and Asset Credits</h2>
        </div>
        <div className="dt-credits-list">
          <div className="panel dt-credit-item">
            <h3>Opening Hero</h3>
            <p>
              AI-assisted conceptual exterior image inspired by Oodi&apos;s documented
              architectural character. Not an official Oodi or City of Helsinki photograph.
            </p>
          </div>
          <div className="panel dt-credit-item">
            <h3>Building Intelligence Illustration</h3>
            <p>
              AI-assisted conceptual building cross-section — illustrative only.
              Not an official Oodi architectural drawing. Does not represent the actual
              structural layout of the building.
            </p>
          </div>
          <div className="panel dt-credit-item">
            <h3>Data Attribution</h3>
            <p>
              Public energy data sourced from the Helsinki Nuuka Open API under its
              public access terms. Weather data sourced from Open-Meteo under the
              CC BY 4.0 license. No endorsement by either provider is implied.
            </p>
          </div>
          <div className="panel dt-credit-item">
            <h3>Reference Images</h3>
            <p>
              Stage 4 reference images are documentary references used during design.
              They are not served at runtime and are not part of the deployed application.
            </p>
          </div>
        </div>
      </section>

      {/* ── Disclosure ──────────────────────────────────────────────────────── */}
      <DisclosureBar>
        Public utility values, current weather context, and conceptual indicators remain visually and textually distinct throughout the application.
      </DisclosureBar>

    </main>
  )
}
