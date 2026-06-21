import { appRoutes, type AppRouteId } from '../../app/routes'

const navRoutes = appRoutes.filter((route) => route.id !== 'opening')

export function TopNavigation({ activeRouteId }: { activeRouteId: AppRouteId }) {
  return (
    <header className="top-nav">
      <a className="top-nav__brand" href="#/" aria-label="Open Oodi landing page">
        <span className="top-nav__wordmark">OODI</span>
        <span className="top-nav__divider" aria-hidden="true" />
        <span>Smart Building Intelligence</span>
      </a>
      <span className="top-nav__badge">Independent Prototype</span>
      <nav className="top-nav__links" aria-label="Primary navigation">
        {navRoutes.map((route) => (
          <a
            aria-current={activeRouteId === route.id ? 'page' : undefined}
            href={route.hash}
            key={route.id}
          >
            {route.label}
          </a>
        ))}
      </nav>
    </header>
  )
}
