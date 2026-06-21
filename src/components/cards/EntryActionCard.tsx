export function EntryActionCard({
  href,
  title,
  description,
}: {
  href: string
  title: string
  description: string
}) {
  return (
    <a className="entry-card" href={href}>
      <span className="entry-card__icon" aria-hidden="true">→</span>
      <strong>{title}</strong>
      <span>{description}</span>
    </a>
  )
}
