import type { ReactNode } from 'react'
import type { AppRouteId } from './routes'
import { TopNavigation } from '../components/layout/TopNavigation'
import { PORTFOLIO_URL, LINKEDIN_URL } from '../content/pageContent'

export function AppShell({
  activeRouteId,
  children,
}: {
  activeRouteId: AppRouteId
  children: ReactNode
}) {
  return (
    <div className="app-shell">
      <TopNavigation activeRouteId={activeRouteId} />
      {children}
      <footer className="app-footer">
        <span className="app-footer__attribution">
          Independent portfolio prototype by Cesar De Macedo
          {' · '}
          <a href={PORTFOLIO_URL} target="_blank" rel="noopener noreferrer" className="app-footer__link">Portfolio</a>
          {' · '}
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="app-footer__link">LinkedIn</a>
        </span>
      </footer>
    </div>
  )
}
