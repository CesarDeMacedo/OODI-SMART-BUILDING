import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import App from '../../App'
import { DataTransparencyPage } from './DataTransparencyPage'
import { OpeningPage } from './OpeningPage'
import { ResourcePerformancePage } from './ResourcePerformancePage'

describe('Stage 4 pages', () => {
  it('renders the opening page as the default app route', () => {
    const markup = renderToStaticMarkup(createElement(App))

    expect(markup).toContain('<span>OODI</span><span>Smart Building Intelligence</span>')
    expect(markup).toContain('data-layout="opening"')
    expect(markup).toContain('href="#/overview"')
  })

  it('renders resource performance controls and layout marker', () => {
    const markup = renderToStaticMarkup(createElement(ResourcePerformancePage))

    expect(markup).toContain('data-layout="resource-performance"')
    expect(markup).toContain('data-utility="electricity"')
    expect(markup).toContain('data-control="utility-selector"')
    expect(markup).toContain('data-control="period-selector"')
    expect(markup).toContain('aria-pressed="true"')
    expect(markup).toContain('resource-overlay')
    expect(markup).toContain('<h1>Resource Performance</h1>')
    expect(markup).toContain('Source Timestamp')
    expect(markup).toContain('resource-compact-utilities')
    expect(markup).not.toContain('utility-grid--related')
    expect(markup).not.toContain('Utility performance with public source context')
    expect(markup).toContain('Electricity')
    expect(markup).toContain('Heat')
    expect(markup).toContain('Water')
    expect(markup).toContain('District Cooling')
    expect(markup).toContain('24 Hours')
    expect(markup).toContain('30 Days')
    expect(markup).toContain('12 Months')
  })

  it('renders all required data classification labels', () => {
    const markup = renderToStaticMarkup(createElement(DataTransparencyPage))

    expect(markup).toContain('Public Building Data')
    expect(markup).toContain('Current Public Weather Data')
    expect(markup).toContain('Conceptual IoT Layer')
    expect(markup).toContain('Cached Public Data Snapshot')
    expect(markup).toContain('Partial Data')
    expect(markup).toContain('Unavailable / Error')
    expect(markup).toContain('Helsinki Nuuka Open API')
    expect(markup).toContain('Open-Meteo forecast API')
  })

  it('keeps opening page low density', () => {
    const markup = renderToStaticMarkup(createElement(OpeningPage))

    expect(markup).toContain('data-layout="opening"')
    expect(markup).not.toContain('Resource Performance —')
    expect(markup).not.toContain('metadata-grid')
    expect(markup).not.toContain('Independent portfolio prototype')
  })

  it('renders one shared disclaimer in the default app shell', () => {
    const markup = renderToStaticMarkup(createElement(App))

    expect(markup.match(/Independent portfolio prototype/g)?.length).toBe(1)
  })

  it('renders opening entry cards with CTA hierarchy hooks', () => {
    const markup = renderToStaticMarkup(createElement(OpeningPage))

    expect(markup).toContain('data-cta="primary"')
    expect(markup).toContain('data-cta="secondary"')
    expect(markup).toContain('data-cta="tertiary"')
  })

  it('renders the approved clean Opening hero image instead of a fallback', () => {
    const markup = renderToStaticMarkup(createElement(OpeningPage))

    expect(markup).toContain('/media/oodi/opening-hero.png')
    expect(markup).not.toContain('Media unavailable')
    expect(markup).not.toContain('openingHeroMedia</strong>')
    expect(markup).not.toContain('/media/stage-04/introduction.png')
  })
})
