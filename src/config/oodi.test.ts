import { describe, expect, it } from 'vitest'
import { oodiConfig } from './oodi'

describe('oodi config', () => {
  it('contains the verified Oodi Nuuka identifiers and source label', () => {
    expect(oodiConfig.nuuka.locationName).toBe('4669 Oodi Helsingin keskustakirjasto')
    expect(oodiConfig.nuuka.propertyCode).toBe('091-002-0014-0005')
    expect(oodiConfig.nuuka.buildingCode).toBe('103534449X')
    expect(oodiConfig.source.label).toContain('Nuuka Open API')
    expect(oodiConfig.source.label).not.toMatch(/\blive\b/i)
  })

  it('derives weather coordinates from the central Oodi location configuration', () => {
    expect(oodiConfig.weather.latitude).toBe(Number(oodiConfig.nuuka.latitude))
    expect(oodiConfig.weather.longitude).toBe(Number(oodiConfig.nuuka.longitude))
    expect(oodiConfig.weather.timezone).toBe('Europe/Helsinki')
  })
})
