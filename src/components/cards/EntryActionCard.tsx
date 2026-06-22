export function EntryActionCard({
  href,
  title,
  description,
  cta = 'secondary',
}: {
  href: string
  title: string
  description: string
  cta?: 'primary' | 'secondary' | 'tertiary'
}) {
  return (
    <a className={`entry-card entry-card--${cta}`} data-cta={cta} href={href}>
      <span className="entry-card__icon" aria-hidden="true">→</span>
      <strong>{title}</strong>
      <span>{description}</span>
    </a>
  )
}
