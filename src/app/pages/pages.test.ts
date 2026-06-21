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

    expect(markup).toContain('OODI Smart Building Intelligence')
    expect(markup).toContain('data-layout="opening"')
    expect(markup).toContain('href="#/overview"')
  })

  it('renders resource performance controls and layout marker', () => {
    const markup = renderToStaticMarkup(createElement(ResourcePerformancePage))

    expect(markup).toContain('data-layout="resource-performance"')
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
  })

  it('keeps opening page low density', () => {
    const markup = renderToStaticMarkup(createElement(OpeningPage))

    expect(markup).toContain('data-layout="opening"')
    expect(markup).not.toContain('Resource Performance —')
    expect(markup).not.toContain('metadata-grid')
  })
})
