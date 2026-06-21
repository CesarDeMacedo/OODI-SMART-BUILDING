import type { ReactNode } from 'react'
import type { AppRouteId } from './routes'
import { TopNavigation } from '../components/layout/TopNavigation'
import { prototypeDisclaimer } from '../content/pageContent'

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
      <footer className="app-footer">{prototypeDisclaimer}</footer>
    </div>
  )
}
