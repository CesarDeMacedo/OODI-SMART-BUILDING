export function InsightCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <article className="insight-card">
      <h3>{title}</h3>
      <p>{children}</p>
    </article>
  )
}
