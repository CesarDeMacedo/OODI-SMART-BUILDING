import { describe, expect, it } from 'vitest'
import { periodOptions, utilityOptions } from './resourcePerformanceState'

describe('resourcePerformanceState', () => {
  it('supports four utilities and three product periods', () => {
    expect(utilityOptions.map((option) => option.id)).toEqual([
      'electricity',
      'heat',
      'water',
      'districtCooling',
    ])
    expect(periodOptions.map((option) => option.value)).toEqual(['24h', '30d', '12m'])
  })
})
