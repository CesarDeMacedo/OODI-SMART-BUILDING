export function MetricCard({
  label,
  value,
  detail,
  utility,
}: {
  label: string
  value: string
  detail: string
  utility?: string
}) {
  return (
    <article className="metric-card" data-utility={utility}>
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{detail}</p>
    </article>
  )
}
