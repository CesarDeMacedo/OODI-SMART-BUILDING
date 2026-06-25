import { useCurrentWeather, useUtilitySummaries } from '../useAppData'
import type { WeatherLoadState } from '../useAppData'
import { ClassificationBadge, DataStatus } from '../../components/layout/DataStatus'
import { DisclosureBar } from '../../components/layout/DisclosureBar'
import { InsightCard } from '../../components/cards/InsightCard'
import { deriveInsights } from '../../features/insights/insightRules'

export function InsightsPage() {
  const utilities = useUtilitySummaries('30d')
  const { loading: weatherLoading, result: weatherResult } = useCurrentWeather()

  const weatherState: WeatherLoadState = { loading: weatherLoading, result: weatherResult }
  const allLoading = Object.values(utilities).every((s) => s.loading) && weatherLoading
  const insights = deriveInsights(utilities, weatherState)

  return (
    <main className="page page--insights" data-layout="insights">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="ins-header">
        <div className="ins-header__top">
          <div className="ins-header__title-group">
            <div className="ovw-icon-box ovw-icon-box--insights" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="5.5" r="3" stroke="currentColor" strokeWidth="1.3" />
                <path
                  d="M5.5 10h3M7 8.5v4"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h1>Insights</h1>
          </div>
          <ClassificationBadge kind="public-utility" label="Rule-based observations" />
        </div>
        <p className="ins-header__desc">
          Deterministic observations derived from available public utility and weather data.
          No unsupported conclusions, forecasts, or causal claims are made.
        </p>
      </div>

      {/* ── Body ────────────────────────────────────────────────────────────── */}
      {allLoading ? (
        <div className="ins-state-wrap">
          <DataStatus state={{ status: 'loading' }} />
        </div>
      ) : insights.length === 0 ? (
        <div className="ins-state-wrap">
          <DataStatus
            state={{
              status: 'empty',
              message: 'No significant observations for the current data state.',
            }}
          />
        </div>
      ) : (
        <div className="ins-cards" role="list" aria-label="Insights">
          {insights.map((item) => (
            <InsightCard
              key={item.id}
              title={item.title}
              emphasis={item.priority === 1 ? 'highlight' : 'normal'}
              kind={item.kind}
            >
              {item.body}
            </InsightCard>
          ))}
        </div>
      )}

      {/* ── Disclosure ──────────────────────────────────────────────────────── */}
      <DisclosureBar>
        Rule-based observations derived from public utility and weather data. Not an operational monitoring or alerting system.
      </DisclosureBar>
    </main>
  )
}
