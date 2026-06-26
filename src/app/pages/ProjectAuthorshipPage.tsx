import { PORTFOLIO_URL, LINKEDIN_URL } from '../../content/pageContent'
import { DisclosureBar } from '../../components/layout/DisclosureBar'

const competencies = [
  { label: 'Full-Stack Development', detail: 'React · TypeScript · Vite · Node' },
  { label: 'API Integration', detail: 'REST · public data APIs · fallback strategy' },
  { label: 'Data Normalisation', detail: 'Period alignment · granularity fallback · provenance tracking' },
  { label: 'UX / UI Direction', detail: 'Information architecture · responsive layout · accessible interaction' },
  { label: 'Data Visualisation', detail: 'Custom SVG charts · interactive overlays · deterministic insight rules' },
  { label: 'Digital Twin Concepts', detail: 'Zone modelling · multi-layer building data · IoT data taxonomy' },
  { label: 'Visual Storytelling', detail: 'Executive-level narrative · data transparency communication' },
  { label: 'Product Strategy', detail: 'Prototype scope · portfolio positioning · feature prioritisation' },
]

export function ProjectAuthorshipPage() {
  return (
    <main className="page page--authorship" data-layout="authorship">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="pa-header">
        <span className="eyebrow">Project Authorship</span>
        <h1>Oodi Smart Building Intelligence</h1>
        <p className="pa-header__positioning">
          Full-Stack Developer&nbsp;·&nbsp;Data Visualisation&nbsp;·&nbsp;Digital Twin Experiences&nbsp;·&nbsp;Smart Building Intelligence
        </p>
        <p className="pa-header__lead">
          A self-initiated portfolio prototype combining public building data, live weather integration,
          data normalisation logic, business rules and executive-level interactive visualisation —
          designed and developed by <strong>Cesar De Macedo</strong>.
        </p>
        <p className="pa-header__note">
          This is an independent conceptual study. It is not an official application created for
          Oodi, the City of Helsinki, Nuuka or WSP.
        </p>
      </div>

      {/* ── Section 1: What This Project Demonstrates ───────────────────────── */}
      <section className="pa-section" aria-labelledby="pa-demonstrates-heading">
        <div className="pa-section__heading">
          <h2 id="pa-demonstrates-heading">What This Project Demonstrates</h2>
        </div>
        <div className="pa-demonstrates-grid">

          <div className="panel pa-demonstrate-card">
            <h3>Full-stack data product</h3>
            <p>
              The application fetches real public utility data from the Helsinki Nuuka Open API,
              normalises it across independent timestamps and granularities, applies fallback
              strategies when live data is unavailable, and presents the result through a
              cohesive executive-level interface.
            </p>
          </div>

          <div className="panel pa-demonstrate-card">
            <h3>Live external API integration</h3>
            <p>
              Current weather context is retrieved from the Open-Meteo forecast API on each session
              and merged with building data without conflating their independent timestamps. The
              integration includes error handling, cached fallbacks and clear provenance labelling.
            </p>
          </div>

          <div className="panel pa-demonstrate-card">
            <h3>Digital twin conceptual layer</h3>
            <p>
              A conceptual IoT layer models 45 building zones with occupancy, indoor comfort, air
              quality, HVAC status and asset health. Data categories are explicitly separated in
              both the interface and the underlying data model — never blended with real public data.
            </p>
          </div>

          <div className="panel pa-demonstrate-card">
            <h3>Product-level design thinking</h3>
            <p>
              From information architecture through interaction design to portfolio positioning,
              the project reflects end-to-end product ownership — not a component exercise or
              an API wrapper, but a coherent product experience with intentional visual storytelling.
            </p>
          </div>

        </div>
      </section>

      {/* ── Section 2: Scope of Contribution ───────────────────────────────── */}
      <section className="pa-section" aria-labelledby="pa-scope-heading">
        <div className="pa-section__heading">
          <h2 id="pa-scope-heading">Scope of Contribution</h2>
        </div>
        <div className="panel pa-scope">
          <div className="pa-scope__cols">

            <div className="pa-scope__col">
              <h3 className="pa-scope__col-label">Designed &amp; built by Cesar De Macedo</h3>
              <ul className="pa-scope__list">
                <li>Product strategy and prototype scope definition</li>
                <li>UX and information architecture across all six pages</li>
                <li>UI design system — tokens, layout, typography, component library</li>
                <li>Front-end implementation in React and TypeScript</li>
                <li>Helsinki Nuuka Open API integration and data normalisation logic</li>
                <li>Open-Meteo live weather API integration</li>
                <li>Fallback strategy across all data layers (live → cached → empty)</li>
                <li>Deterministic insight engine and business logic</li>
                <li>Conceptual IoT data model and zone taxonomy</li>
                <li>Responsive and accessible layout across desktop and mobile</li>
                <li>Visual storytelling and executive-level data narrative</li>
                <li>Portfolio positioning and data transparency documentation</li>
              </ul>
            </div>

            <div className="pa-scope__col pa-scope__col--sources">
              <h3 className="pa-scope__col-label">External data sources used</h3>
              <div className="pa-scope__source-list">
                <div className="pa-scope__source">
                  <span className="pa-scope__source-dot pa-scope__source-dot--public" />
                  <div>
                    <p className="pa-scope__source-name">Helsinki Nuuka Open API</p>
                    <p className="pa-scope__source-desc">
                      Public building utility data — electricity, heat, water, district cooling.
                      Fetched live; authentic public data, not simulated.
                    </p>
                  </div>
                </div>
                <div className="pa-scope__source">
                  <span className="pa-scope__source-dot pa-scope__source-dot--weather" />
                  <div>
                    <p className="pa-scope__source-name">Open-Meteo Forecast API</p>
                    <p className="pa-scope__source-desc">
                      Current public weather context for Oodi&apos;s coordinates.
                      Model-based — not a physical rooftop sensor.
                    </p>
                  </div>
                </div>
                <div className="pa-scope__source">
                  <span className="pa-scope__source-dot pa-scope__source-dot--conceptual" />
                  <div>
                    <p className="pa-scope__source-name">Conceptual IoT Layer</p>
                    <p className="pa-scope__source-desc">
                      Deterministic prototype dataset authored for this project.
                      Not connected to Oodi&apos;s BMS or any real sensor infrastructure.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Section 3: Demonstrated Competencies ────────────────────────────── */}
      <section className="pa-section" aria-labelledby="pa-competencies-heading">
        <div className="pa-section__heading">
          <h2 id="pa-competencies-heading">Demonstrated Competencies</h2>
        </div>
        <div className="pa-competencies-grid">
          {competencies.map((c) => (
            <div className="panel pa-competency-card" key={c.label}>
              <p className="pa-competency-card__label">{c.label}</p>
              <p className="pa-competency-card__detail">{c.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 4: Project Integrity ─────────────────────────────────────── */}
      <section className="pa-section" aria-labelledby="pa-integrity-heading">
        <div className="pa-section__heading">
          <h2 id="pa-integrity-heading">Project Integrity</h2>
        </div>
        <div className="panel pa-integrity">
          <div className="pa-integrity__body">

            <div className="pa-integrity__block">
              <h3>What this project is</h3>
              <p>
                A self-initiated full-stack portfolio prototype demonstrating technical depth
                across data integration, front-end engineering and product design. It uses real
                public data and clearly labelled conceptual content to illustrate what a smart
                building intelligence product could look like at an executive level.
              </p>
            </div>

            <div className="pa-integrity__block">
              <h3>What this project is not</h3>
              <p>
                This is not an official application commissioned by or associated with Helsinki
                Central Library Oodi, the City of Helsinki, Nuuka, Open-Meteo or WSP. It is not
                connected to an operational building-management system and has no live control
                capability. The Oodi name and building are used as a well-documented public
                reference subject for the prototype — no endorsement or affiliation is implied.
              </p>
            </div>

            <div className="pa-integrity__block">
              <h3>Data transparency</h3>
              <p>
                Real public building data, live weather context and conceptual IoT indicators
                are visually and textually distinct throughout the application. Each data module
                carries a classification label. The{' '}
                <a href="#/data-transparency" className="pa-integrity__link">Data Transparency</a>
                {' '}page documents every source, methodology, limitation and fallback strategy
                in detail.
              </p>
            </div>

          </div>

          <div className="pa-integrity__ctas">
            <a
              href={PORTFOLIO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="pa-integrity__cta"
            >
              View Portfolio
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="pa-integrity__cta"
            >
              Connect on LinkedIn
            </a>
          </div>
        </div>
      </section>

      <DisclosureBar>
        Self-initiated portfolio prototype — not affiliated with Oodi, the City of Helsinki, Nuuka or WSP.
      </DisclosureBar>

    </main>
  )
}
