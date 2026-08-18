import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

import { normalizeSiteUrl } from '../../src/lib/siteUrl.ts'

describe('normalizeSiteUrl', () => {
  it('keeps a full https URL and strips a trailing slash', () => {
    assert.equal(
      normalizeSiteUrl('https://milano-demo.vercel.app/'),
      'https://milano-demo.vercel.app',
    )
  })

  it('adds https when the protocol is missing', () => {
    assert.equal(normalizeSiteUrl('milano-demo.vercel.app'), 'https://milano-demo.vercel.app')
  })

  it('falls back when empty', () => {
    assert.equal(normalizeSiteUrl(''), 'http://localhost:3000')
  })
})
