import type { InsightKind } from '../../features/insights/insightRules'

export function InsightCard({
  title,
  children,
  emphasis = 'normal',
  kind,
}: {
  title: string
  children: React.ReactNode
  emphasis?: 'normal' | 'highlight'
  kind?: InsightKind
}) {
  const classes = [
    'insight-card',
    `insight-card--${emphasis}`,
    kind ? `insight-card--kind-${kind}` : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <article className={classes}>
      <h3>{title}</h3>
      <p>{children}</p>
    </article>
  )
}
