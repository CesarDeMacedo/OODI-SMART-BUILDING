import { describe, expect, it, vi } from 'vitest'
import { fetchNuukaJson } from './nuukaClient'

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
