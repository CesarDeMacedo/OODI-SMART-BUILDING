import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { ClassificationBadge, DataStatus } from './DataStatus'

describe('DataStatus', () => {
  it('renders all local module states with non-color semantic markers', () => {
    const states = [
      { status: 'loading' as const },
      { status: 'success' as const, data: 'ready' },
      { status: 'partial' as const, data: 'partial', message: 'Partial data available' },
      { status: 'empty' as const, message: 'No data available' },
      { status: 'error' as const, message: 'Weather unavailable', retryable: true },
      { status: 'memory-cache' as const, message: 'Memory cache' },
      { status: 'cached-public-snapshot' as const, message: 'Cached Public Data Snapshot' },
      { status: 'conceptual' as const, message: 'Conceptual IoT Layer' },
    ]

    const markup = states
      .map((state) => renderToStaticMarkup(createElement(DataStatus, { state })))
      .join('')

    expect(markup).toContain('Loading')
    expect(markup).toContain('Available')
    expect(markup).toContain('Partial data available')
    expect(markup).toContain('No data available')
    expect(markup).toContain('Weather unavailable')
    expect(markup).toContain('Memory cache')
    expect(markup).toContain('Cached Public Data Snapshot')
    expect(markup).toContain('Conceptual IoT Layer')
    expect(markup).toContain('data-state="cached-public-snapshot"')
    expect(markup).toContain('data-state="conceptual"')
    expect(markup).toContain('data-status-icon')
  })

  it('renders all Stage 5 data-classification badge variants', () => {
    const badges = [
      ['public-utility', 'Public Building Data'],
      ['current-weather', 'Current Public Weather Data'],
      ['cached-public-snapshot', 'Cached Public Data Snapshot'],
      ['conceptual', 'Conceptual IoT Layer'],
      ['partial-data', 'Partial Data'],
      ['unavailable', 'Unavailable / Error'],
    ] as const

    const markup = badges
      .map(([kind, label]) => renderToStaticMarkup(createElement(ClassificationBadge, { kind, label })))
      .join('')

    expect(markup).toContain('data-classification="public-utility"')
    expect(markup).toContain('data-classification="current-weather"')
    expect(markup).toContain('data-classification="cached-public-snapshot"')
    expect(markup).toContain('data-classification="conceptual"')
    expect(markup).toContain('data-classification="partial-data"')
    expect(markup).toContain('data-classification="unavailable"')
    expect(markup).toContain('data-classification-icon')
  })
})
