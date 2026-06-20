import { describe, expect, it, vi } from 'vitest'
import { fetchNuukaJson } from './nuukaClient'
import { buildNuukaEnergyUrl } from './nuukaEndpoints'

describe('Nuuka client', () => {
  it('maps successful JSON responses', async () => {
    const fetcher = vi.fn(async () => new Response(JSON.stringify([{ ok: true }]), { status: 200 }))

    await expect(fetchNuukaJson('https://example.test', { fetcher })).resolves.toEqual({
      ok: true,
      data: [{ ok: true }],
    })
  })

  it('maps invalid JSON to a typed error', async () => {
    const fetcher = vi.fn(async () => new Response('{no', { status: 200 }))
    const result = await fetchNuukaJson('https://example.test', { fetcher })

    expect(result.ok).toBe(false)
    if (result.ok) throw new Error('expected error')
    expect(result.error.code).toBe('INVALID_JSON')
  })

  it('maps HTTP 503 as retryable', async () => {
    const fetcher = vi.fn(async () => new Response('{}', { status: 503 }))
    const result = await fetchNuukaJson('https://example.test', { fetcher })

    expect(result.ok).toBe(false)
    if (result.ok) throw new Error('expected error')
    expect(result.error).toMatchObject({ code: 'HTTP', retryable: true, statusCode: 503 })
  })

  it('maps confirmed Nuuka energy no-data 404 responses to an empty row payload', async () => {
    const endpoint = buildNuukaEnergyUrl({
      reportingGroup: 'Electricity',
      granularity: 'daily',
      start: '2026-05-21',
      end: '2026-06-20',
    })
    const fetcher = vi.fn(
      async () =>
        new Response(
          JSON.stringify({
            errorNote: 'No data found with the given search parameters',
            errorCode: 'MissingSettingsException',
          }),
          { status: 404 },
        ),
    )

    await expect(fetchNuukaJson(endpoint, { fetcher })).resolves.toEqual({
      ok: true,
      data: [],
    })
  })

  it('does not treat non-no-data Nuuka energy 404 payloads as empty rows', async () => {
    const endpoint = buildNuukaEnergyUrl({
      reportingGroup: 'Electricity',
      granularity: 'daily',
      start: '2026-05-21',
      end: '2026-06-20',
    })
    const fetcher = vi.fn(
      async () =>
        new Response(JSON.stringify({ errorCode: 'RouteNotFound' }), {
          status: 404,
        }),
    )

    const result = await fetchNuukaJson(endpoint, { fetcher })

    expect(result.ok).toBe(false)
    if (result.ok) throw new Error('expected error')
    expect(result.error).toMatchObject({ code: 'HTTP', statusCode: 404 })
  })

  it('keeps unrelated 404 responses as typed HTTP errors', async () => {
    const fetcher = vi.fn(async () => new Response('', { status: 404 }))
    const result = await fetchNuukaJson('https://example.test/missing', { fetcher })

    expect(result.ok).toBe(false)
    if (result.ok) throw new Error('expected error')
    expect(result.error).toMatchObject({ code: 'HTTP', retryable: false, statusCode: 404 })
  })

  it('maps request timeouts to a typed timeout error', async () => {
    const fetcher = vi.fn(
      (_endpoint: string | URL | Request, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => {
            reject(new DOMException('The operation was aborted.', 'AbortError'))
          })
        }),
    )

    const result = await fetchNuukaJson('https://example.test', {
      fetcher,
      timeoutMs: 1,
    })

    expect(result.ok).toBe(false)
    if (result.ok) throw new Error('expected error')
    expect(result.error).toMatchObject({ code: 'TIMEOUT', retryable: true })
  })
})
