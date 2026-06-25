import { useCurrentWeather, useUtilitySummaries } from '../useAppData'
import type { WeatherLoadState } from '../useAppData'
import { ClassificationBadge, DataStatus } from '../../components/layout/DataStatus'
import { DisclosureBar } from '../../components/layout/DisclosureBar'
import { InsightCard } from '../../components/cards/InsightCard'
import { deriveInsights } from '../../features/insights/insightRules'

const UTILITY_LABEL: Record<string, string> = {
  electricity: 'Electricity',
  heat: 'Heat',
  water: 'Water',
  districtCooling: 'District Cooling',
}

const MAX_PRIORITY_ITEMS = 5
const MAX_NOTICE_IN_PRIORITY = 2

export function InsightsPage() {
  const utilities = useUtilitySummaries('30d')
  const { loading: weatherLoading, result: weatherResult } = useCurrentWeather()

  const weatherState: WeatherLoadState = { loading: weatherLoading, result: weatherResult }
  const allLoading = Object.values(utilities).every((s) => s.loading) && weatherLoading
  const insights = deriveInsights(utilities, weatherState)

  // Cap Data Notice (quality) items at 2 in Priority Insights; fill remaining
  // slots with fallback (period comparison) items. Weather, reading, and
  // summary each have dedicated sections below and are excluded here to avoid
  // duplicate full cards. Fewer cards are shown rather than duplicating content.
  const allQualityItems = insights.filter((i) => i.kind === 'quality')
  const allFallbackItems = insights.filter((i) => i.kind === 'fallback')
  const priorityNoticeItems = allQualityItems.slice(0, MAX_NOTICE_IN_PRIORITY)
  const remainingSlots = MAX_PRIORITY_ITEMS - priorityNoticeItems.length
  const priorityItems = [
    ...priorityNoticeItems,
    ...allFallbackItems.slice(0, remainingSlots),
  ]
  const priorityIds = new Set(priorityItems.map((i) => i.id))
  const dataQualityItems = insights.filter(
    (i) => (i.kind === 'quality' || i.kind === 'fallback') && !priorityIds.has(i.id),
  )
  const readingItems = insights.filter((i) => i.kind === 'reading')
  const weatherItems = insights.filter((i) => i.kind === 'weather')
  const summaryItems = insights.filter((i) => i.kind === 'summary')

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
        <>
          {/* ── 1. Priority Insights ─────────────────────────────────────── */}
          {priorityItems.length > 0 && (
            <section className="ins-section" aria-labelledby="ins-priority-title">
              <h2 id="ins-priority-title" className="ins-section__title">Priority Insights</h2>
              <div className="ins-cards ins-cards--priority" role="list" aria-label="Priority insights">
                {priorityItems.map((item) => (
                  <InsightCard key={item.id} title={item.title} kind={item.kind}>
                    {item.body}
                  </InsightCard>
                ))}
              </div>
            </section>
          )}

          {/* ── 2. Latest Readings + Weather ─────────────────────────────── */}
          {(readingItems.length > 0 || weatherItems.length > 0) && (
            <div className="ins-readings-weather">
              {readingItems.length > 0 && (
                <section className="ins-section" aria-labelledby="ins-readings-title">
                  <h2 id="ins-readings-title" className="ins-section__title">
                    Latest Available Readings
                  </h2>
                  <div className="ins-readings-grid" role="list" aria-label="Latest utility readings">
                    {readingItems.map((item) => (
                      <div
                        key={item.id}
                        role="listitem"
                        className={`ins-reading-chip${item.utility ? ` ins-reading-chip--${item.utility}` : ''}`}
                      >
                        <span className="ins-reading-chip__label">
                          {item.utility ? (UTILITY_LABEL[item.utility] ?? item.utility) : item.title}
                        </span>
                        <p className="ins-reading-chip__body">{item.body}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {weatherItems.length > 0 && (
                <section className="ins-section ins-section--weather" aria-labelledby="ins-weather-title">
                  <h2 id="ins-weather-title" className="ins-section__title">Weather Context</h2>
                  <div role="list" aria-label="Weather context">
                    {weatherItems.map((item) => (
                      <InsightCard key={item.id} title={item.title} kind={item.kind}>
                        {item.body}
                      </InsightCard>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}

          {/* ── 3. Data Quality & Coverage ───────────────────────────────── */}
          {dataQualityItems.length > 0 && (
            <section className="ins-section" aria-labelledby="ins-quality-title">
              <h2 id="ins-quality-title" className="ins-section__title">
                Data Quality &amp; Coverage
              </h2>
              <div className="ins-cards" role="list" aria-label="Data quality and coverage">
                {dataQualityItems.map((item) => (
                  <InsightCard key={item.id} title={item.title} kind={item.kind}>
                    {item.body}
                  </InsightCard>
                ))}
              </div>
            </section>
          )}

          {/* ── 4. Period Context ────────────────────────────────────────── */}
          {summaryItems.length > 0 && (
            <section className="ins-section" aria-labelledby="ins-period-title">
              <h2 id="ins-period-title" className="ins-section__title">Period Context</h2>
              <div className="ins-cards ins-cards--dense" role="list" aria-label="Period context">
                {summaryItems.map((item) => (
                  <InsightCard key={item.id} title={item.title} kind={item.kind}>
                    {item.body}
                  </InsightCard>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* ── Disclosure ──────────────────────────────────────────────────────── */}
      <DisclosureBar>
        Rule-based observations derived from public utility and weather data. Not an operational monitoring or alerting system.
      </DisclosureBar>
    </main>
  )
}
