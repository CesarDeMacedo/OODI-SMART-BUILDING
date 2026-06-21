import { describe, expect, it } from 'vitest'
import { appRoutes, getRouteByHash } from './routes'

describe('appRoutes', () => {
  it('defines the six Stage 4 pages', () => {
    expect(appRoutes.map((route) => route.id)).toEqual([
      'opening',
      'overview',
      'resourcePerformance',
      'buildingIntelligence',
      'insights',
      'dataTransparency',
    ])
  })

  it('maps unknown hashes to the opening page', () => {
    expect(getRouteByHash('#/resource-performance').id).toBe('resourcePerformance')
    expect(getRouteByHash('#/missing').id).toBe('opening')
    expect(getRouteByHash('').id).toBe('opening')
  })
})
