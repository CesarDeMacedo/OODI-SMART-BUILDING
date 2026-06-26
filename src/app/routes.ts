export type AppRouteId =
  | 'opening'
  | 'overview'
  | 'resourcePerformance'
  | 'buildingIntelligence'
  | 'insights'
  | 'dataTransparency'
  | 'projectAuthorship'

export interface AppRoute {
  id: AppRouteId
  label: string
  hash: string
  shortLabel?: string
}

export const appRoutes: readonly AppRoute[] = [
  { id: 'opening', label: 'Opening', hash: '#/' },
  { id: 'overview', label: 'Overview', hash: '#/overview' },
  {
    id: 'resourcePerformance',
    label: 'Resource Performance',
    hash: '#/resource-performance',
    shortLabel: 'Performance',
  },
  {
    id: 'buildingIntelligence',
    label: 'Building Intelligence',
    hash: '#/building-intelligence',
    shortLabel: 'Intelligence',
  },
  { id: 'insights', label: 'Insights', hash: '#/insights' },
  {
    id: 'dataTransparency',
    label: 'Data Transparency',
    hash: '#/data-transparency',
    shortLabel: 'Transparency',
  },
  {
    id: 'projectAuthorship',
    label: 'About / Authorship',
    hash: '#/about',
    shortLabel: 'About',
  },
] as const

export function getRouteByHash(hash: string): AppRoute {
  return appRoutes.find((route) => route.hash === hash) ?? appRoutes[0]
}

export function getRouteById(id: AppRouteId): AppRoute {
  return appRoutes.find((route) => route.id === id) ?? appRoutes[0]
}
