import { describe, expect, it } from 'vitest'
import { mediaAssets } from './mediaAssets'

describe('mediaAssets', () => {
  it('maps the three approved Stage 4 runtime hero assets through semantic slots', () => {
    expect(mediaAssets.openingHeroMedia?.src).toBe('/media/stage-04/introduction.png')
    expect(mediaAssets.overviewHeroMedia?.src).toBe('/media/stage-04/overview.png')
    expect(mediaAssets.resourcePerformanceHeroMedia?.src).toBe(
      '/media/stage-04/resource-performance-energy.png',
    )
  })

  it('keeps the Resource Performance overlay slot separate from base hero media', () => {
    expect(mediaAssets.resourcePerformanceOverlayMedia).toBeNull()
    expect(mediaAssets.resourcePerformanceHeroMedia).not.toBeNull()
  })
})
