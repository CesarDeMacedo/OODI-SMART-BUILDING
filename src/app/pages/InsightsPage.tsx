import { InsightCard } from '../../components/cards/InsightCard'
import { cautiousInsights } from '../../content/pageContent'

export function InsightsPage() {
  return (
    <main className="page page--shell" data-layout="insights">
      <section className="shell-copy">
        <span className="eyebrow">Insights</span>
        <h1>Cautious Observations</h1>
        <p>
          Stage 4 reserves the insight structure without adding causal claims,
          formal anomaly detection, or engineering recommendations.
        </p>
      </section>
      <section className="insight-list">
        {cautiousInsights.map((insight, index) => (
          <InsightCard key={insight} title={`Observation ${index + 1}`}>
            {insight}
          </InsightCard>
        ))}
      </section>
    </main>
  )
}
