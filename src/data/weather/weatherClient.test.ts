import { describe, expect, it, vi } from 'vitest'
import { fetchOpenMeteoJson } from './weatherClient'

describe('Open-Meteo client', () => {
  it('maps successful JSON responses', async () => {
    const fetcher = vi.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 }))

    await expect(fetchOpenMeteoJson('https://example.test', { fetcher })).resolves.toEqual({
      ok: true,
      data: { ok: true },
    })
  })

  it('maps invalid JSON to a typed error', async () => {
    const fetcher = vi.fn(async () => new Response('{no', { status: 200 }))
    const result = await fetchOpenMeteoJson('https://example.test', { fetcher })

    expect(result.ok).toBe(false)
    if (result.ok) throw new Error('expected error')
    expect(result.error.code).toBe('INVALID_JSON')
  })

  it('maps Open-Meteo HTTP 400 errors without retrying', async () => {
    const fetcher = vi.fn(async () =>
      new Response(JSON.stringify({ error: true, reason: 'Bad parameter.' }), { status: 400 }),
    )
    const result = await fetchOpenMeteoJson('https://example.test', { fetcher })

    expect(result.ok).toBe(false)
    if (result.ok) throw new Error('expected error')
    expect(result.error).toMatchObject({
      code: 'HTTP',
      retryable: false,
      statusCode: 400,
      message: 'Open-Meteo request failed with HTTP 400: Bad parameter.',
    })
    expect(fetcher).toHaveBeenCalledTimes(1)
  })

  it('retries one retryable HTTP failure', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(new Response('{}', { status: 503 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 200 }))

    const result = await fetchOpenMeteoJson('https://example.test', { fetcher })

    expect(result.ok).toBe(true)
    expect(fetcher).toHaveBeenCalledTimes(2)
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

    const result = await fetchOpenMeteoJson('https://example.test', {
      fetcher,
      timeoutMs: 1,
    })

    expect(result.ok).toBe(false)
    if (result.ok) throw new Error('expected error')
    expect(result.error).toMatchObject({ code: 'TIMEOUT', retryable: true })
  })
})
