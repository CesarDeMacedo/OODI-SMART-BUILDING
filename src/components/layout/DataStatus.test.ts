import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { DataStatus } from './DataStatus'

describe('DataStatus', () => {
  it('renders all local module states', () => {
    const states = [
      { status: 'loading' as const },
      { status: 'success' as const, data: 'ready' },
      { status: 'partial' as const, data: 'partial', message: 'Partial data available' },
      { status: 'empty' as const, message: 'No data available' },
      { status: 'error' as const, message: 'Weather unavailable', retryable: true },
    ]

    const markup = states
      .map((state) => renderToStaticMarkup(createElement(DataStatus, { state })))
      .join('')

    expect(markup).toContain('Loading')
    expect(markup).toContain('Available')
    expect(markup).toContain('Partial data available')
    expect(markup).toContain('No data available')
    expect(markup).toContain('Weather unavailable')
  })
})
