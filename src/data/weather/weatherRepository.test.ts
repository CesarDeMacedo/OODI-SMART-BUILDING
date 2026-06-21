import { describe, expect, it, vi } from 'vitest'
import successFixture from './fixtures/openMeteo-success.json'
import { createWeatherRepository } from './weatherRepository'
import type { WeatherDataError } from './weatherTypes'

describe('weather repository', () => {
  it('returns normalized Open-Meteo weather through the application-facing API', async () => {
    const repository = createWeatherRepository({
      fetchPayload: async () => successFixture,
      retrievedAt: () => '2026-06-20T02:01:00.000Z',
    })

    const result = await repository.getWeather()

    expect(result.status).toBe('success')
    if (result.status !== 'success') throw new Error('expected success')
    expect(result.weather.provider.origin).toBe('network')
    expect(result.weather.provider.generationTimeMs).toBe(0.478)
    expect(result.weather.current.sourceTimestamp).toBe('2026-06-20T02:00')
    expect(result.weather.hourly).toHaveLength(24)
    expect(result.weather.daily).toHaveLength(3)
  })

  it('reuses identical cached requests and labels the second result as memory cache', async () => {
    const fetchPayload = vi.fn(async () => successFixture)
    const repository = createWeatherRepository({
      fetchPayload,
      retrievedAt: () => '2026-06-20T02:01:00.000Z',
    })

    const first = await repository.getWeather()
    const second = await repository.getWeather()

    expect(fetchPayload).toHaveBeenCalledTimes(1)
    expect(first.status).toBe('success')
    expect(second.status).toBe('success')
    if (first.status !== 'success' || second.status !== 'success') {
      throw new Error('expected success')
    }
    expect(first.weather.provider.origin).toBe('network')
    expect(second.weather.provider.origin).toBe('memory-cache')
    expect(second.weather.current.sourceTimestamp).toBe(first.weather.current.sourceTimestamp)
  })

  it('labels force refresh as network after a completed cache hit', async () => {
    const fetchPayload = vi.fn(async () => successFixture)
    const repository = createWeatherRepository({
      fetchPayload,
      retrievedAt: () => '2026-06-20T02:01:00.000Z',
    })

    await repository.getWeather()
    await repository.getWeather()
    const refreshed = await repository.getWeather({ refresh: 'force' })

    expect(fetchPayload).toHaveBeenCalledTimes(2)
    expect(refreshed.status).toBe('success')
    if (refreshed.status !== 'success') throw new Error('expected success')
    expect(refreshed.weather.provider.origin).toBe('network')
  })

  it('deduplicates in-flight default requests', async () => {
    const fetchPayload = vi.fn(
      () =>
        new Promise<unknown>((resolve) => {
          setTimeout(() => resolve(successFixture), 1)
        }),
    )
    const repository = createWeatherRepository({ fetchPayload })

    const [first, second] = await Promise.all([
      repository.getWeather(),
      repository.getWeather(),
    ])

    expect(fetchPayload).toHaveBeenCalledTimes(1)
    expect(first.status).toBe('success')
    expect(second.status).toBe('success')
  })

  it('returns validation errors without throwing', async () => {
    const repository = createWeatherRepository({
      fetchPayload: async () => ({ current: { time: '2026-06-20T02:00' } }),
    })

    const result = await repository.getWeather()

    expect(result.status).toBe('error')
    if (result.status !== 'error') throw new Error('expected error')
    expect(result.error.code).toBe('MISSING_CURRENT')
  })

  it('preserves previous weather on refresh failure', async () => {
    const networkError: WeatherDataError = {
      code: 'NETWORK',
      message: 'Open-Meteo network request failed.',
      retryable: true,
    }
    const fetchPayload = vi
      .fn()
      .mockResolvedValueOnce(successFixture)
      .mockRejectedValueOnce(networkError)
    const repository = createWeatherRepository({
      fetchPayload,
      retrievedAt: () => '2026-06-20T02:01:00.000Z',
    })

    const first = await repository.getWeather()
    const second = await repository.getWeather({ refresh: 'force' })

    expect(first.status).toBe('success')
    expect(second.status).toBe('error')
    if (first.status !== 'success' || second.status !== 'error') {
      throw new Error('expected previous weather on error')
    }
    expect(second.previousWeather?.current.sourceTimestamp).toBe(
      first.weather.current.sourceTimestamp,
    )
  })

  it('returns aborted when the caller signal is already aborted', async () => {
    const controller = new AbortController()
    controller.abort()
    const fetchPayload = vi.fn()
    const repository = createWeatherRepository({ fetchPayload })

    const result = await repository.getWeather({ signal: controller.signal })

    expect(result.status).toBe('error')
    if (result.status !== 'error') throw new Error('expected error')
    expect(result.error.code).toBe('ABORTED')
    expect(fetchPayload).not.toHaveBeenCalled()
  })
})
