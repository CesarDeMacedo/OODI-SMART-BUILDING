import { useEffect, useState } from 'react'
import './App.css'
import { AppShell } from './app/AppShell'
import { getRouteByHash, type AppRoute, type AppRouteId } from './app/routes'
import { BuildingIntelligencePage } from './app/pages/BuildingIntelligencePage'
import { DataTransparencyPage } from './app/pages/DataTransparencyPage'
import { InsightsPage } from './app/pages/InsightsPage'
import { OpeningPage } from './app/pages/OpeningPage'
import { OverviewPage } from './app/pages/OverviewPage'
import { ResourcePerformancePage } from './app/pages/ResourcePerformancePage'

function getCurrentRoute(): AppRoute {
  if (typeof window === 'undefined') {
    return getRouteByHash('#/')
  }

  return getRouteByHash(window.location.hash)
}

function App() {
  const [route, setRoute] = useState<AppRoute>(() => getCurrentRoute())

  useEffect(() => {
    const handleHashChange = () => setRoute(getCurrentRoute())
    handleHashChange()
    window.addEventListener('hashchange', handleHashChange)

    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  return (
    <AppShell activeRouteId={route.id}>
      <RoutePage routeId={route.id} />
    </AppShell>
  )
}

function RoutePage({ routeId }: { routeId: AppRouteId }) {
  if (routeId === 'overview') {
    return <OverviewPage />
  }

  if (routeId === 'resourcePerformance') {
    return <ResourcePerformancePage />
  }

  if (routeId === 'buildingIntelligence') {
    return <BuildingIntelligencePage />
  }

  if (routeId === 'insights') {
    return <InsightsPage />
  }

  if (routeId === 'dataTransparency') {
    return <DataTransparencyPage />
  }

  return <OpeningPage />
}

export default App
