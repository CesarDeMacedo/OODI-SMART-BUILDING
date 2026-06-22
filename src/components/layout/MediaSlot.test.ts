import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { MediaSlot } from './MediaSlot'

describe('MediaSlot', () => {
  it('renders image assets with alt text', () => {
    const markup = renderToStaticMarkup(
      createElement(MediaSlot, {
        asset: {
          type: 'image',
          src: '/media/oodi.jpg',
          alt: 'Oodi exterior at dusk',
          aspectRatio: '16 / 9',
          objectFit: 'cover',
          objectPosition: 'center top',
        },
        slotName: 'overviewHeroMedia',
      }),
    )

    expect(markup).toContain('img')
    expect(markup).toContain('alt="Oodi exterior at dusk"')
    expect(markup).toContain('/media/oodi.jpg')
    expect(markup).toContain('object-position:center top')
  })

  it('renders video assets with poster support', () => {
    const markup = renderToStaticMarkup(
      createElement(MediaSlot, {
        asset: {
          type: 'video',
          src: '/media/oodi.mp4',
          poster: '/media/oodi-poster.jpg',
          alt: 'Oodi animated system layer',
          aspectRatio: '21 / 9',
          objectFit: 'cover',
        },
        slotName: 'resourcePerformanceHeroMedia',
      }),
    )

    expect(markup).toContain('video')
    expect(markup).toContain('poster="/media/oodi-poster.jpg"')
    expect(markup).toContain('aria-label="Oodi animated system layer"')
    expect(markup).toContain('muted=""')
    expect(markup).toContain('playsInline=""')
  })

  it('renders a stable unavailable fallback for missing media', () => {
    const markup = renderToStaticMarkup(
      createElement(MediaSlot, { asset: null, slotName: 'openingHeroMedia' }),
    )

    expect(markup).toContain('Media unavailable')
    expect(markup).not.toContain('<img')
    expect(markup).toContain('media-slot__fallback')
    expect(markup).toContain('data-media-state="fallback"')
  })

  it('renders an optional overlay layer independently from base media', () => {
    const markup = renderToStaticMarkup(
      createElement(MediaSlot, {
        asset: {
          type: 'image',
          src: '/media/base.png',
          alt: 'Base Oodi media',
          aspectRatio: '21 / 9',
          objectFit: 'cover',
        },
        overlay: {
          type: 'image',
          src: '/media/overlay.png',
          alt: 'Analytical overlay',
          aspectRatio: '21 / 9',
          objectFit: 'contain',
        },
        slotName: 'resourcePerformanceHeroMedia',
      }),
    )

    expect(markup).toContain('/media/base.png')
    expect(markup).toContain('/media/overlay.png')
    expect(markup).toContain('media-slot__overlay')
    expect(markup).toContain('data-media-overlay="true"')
  })
})
