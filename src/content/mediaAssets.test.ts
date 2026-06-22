import { describe, expect, it } from 'vitest'
import { mediaAssets } from './mediaAssets'

describe('mediaAssets', () => {
  it('maps the approved Opening runtime hero image through the semantic slot', () => {
    expect(mediaAssets.openingHeroMedia).toMatchObject({
      type: 'image',
      src: '/media/oodi/opening-hero.png',
      aspectRatio: '16 / 9',
      objectFit: 'cover',
    })
  })

  it('does not use approved full-page UI reference screenshots as runtime hero media', () => {
    const runtimeMedia = [
      mediaAssets.openingHeroMedia,
      mediaAssets.overviewHeroMedia,
      mediaAssets.resourcePerformanceHeroMedia,
    ]

    for (const asset of runtimeMedia) {
      expect(asset?.src).not.toBe('/media/stage-04/introduction.png')
      expect(asset?.src).not.toBe('/media/stage-04/overview.png')
      expect(asset?.src).not.toBe('/media/stage-04/resource-performance-energy.png')
    }
  })

  it('maps Overview and Resource Performance to clean architectural runtime media', () => {
    expect(mediaAssets.overviewHeroMedia).toMatchObject({
      type: 'image',
      src: '/media/oodi/opening-hero.png',
      aspectRatio: '21 / 9',
      objectFit: 'cover',
    })
    expect(mediaAssets.resourcePerformanceHeroMedia).toMatchObject({
      type: 'image',
      src: '/media/oodi/opening-hero.png',
      aspectRatio: '21 / 9',
      objectFit: 'cover',
    })
  })

  it('keeps the Resource Performance overlay slot separate from base hero media', () => {
    expect(mediaAssets.resourcePerformanceOverlayMedia).toBeNull()
    expect(mediaAssets.resourcePerformanceHeroMedia).not.toBeNull()
  })
})
