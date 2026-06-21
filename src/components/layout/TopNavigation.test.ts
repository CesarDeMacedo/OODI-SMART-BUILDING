import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { TopNavigation } from './TopNavigation'

describe('TopNavigation', () => {
  it('renders required navigation links with active page state', () => {
    const markup = renderToStaticMarkup(
      createElement(TopNavigation, { activeRouteId: 'resourcePerformance' }),
    )

    expect(markup).toContain('OODI')
    expect(markup).toContain('Smart Building Intelligence')
    expect(markup).toContain('Independent Prototype')
    expect(markup).toContain('Overview')
    expect(markup).toContain('Resource Performance')
    expect(markup).toContain('Building Intelligence')
    expect(markup).toContain('Insights')
    expect(markup).toContain('Data Transparency')
    expect(markup).toContain('aria-current="page"')
    expect(markup).toContain('href="#/resource-performance"')
  })
})
