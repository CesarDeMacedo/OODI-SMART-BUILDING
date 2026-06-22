export function InsightCard({
  title,
  children,
  emphasis = 'normal',
}: {
  title: string
  children: React.ReactNode
  emphasis?: 'normal' | 'highlight'
}) {
  return (
    <article className={`insight-card insight-card--${emphasis}`}>
      <h3>{title}</h3>
      <p>{children}</p>
    </article>
  )
}
