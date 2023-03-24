import { describe, it, expect, beforeEach } from 'vitest'
import { createSanitize } from '../../../src/utils/createSanitize'

const sanitize = createSanitize()

describe('sanitize', () => {
  it('should return same text', () => {
    const result = sanitize('hello world')
    expect(result).toBe('hello world')
  })

  it('should strip out script tags completely', () => {
    const result = sanitize(
      '<b>safe text</b> here <script>alert("bad stuff here")</script>'
    )
    expect(result).toContain('<b>safe text</b> here')
    expect(result).not.toContain('script')
    expect(result).not.toContain('alert')
  })

  it('should only keep tags listed in SanitizeOptions', () => {
    const result = sanitize('<h1><b>bold header</b></h1>', { tags: ['b'] })
    expect(result).toBe('<b>bold header</b>')
  })

  it('should remove dangerous attributes', () => {
    const result = sanitize(
      '<a onclick="alert("bad code here")">click me</a>',
      { tags: ['a'] }
    )
    expect(result).not.toContain('bad code')
  })

  it('should remove javascript: links', () => {
    const result = sanitize(
      '<a href="javascript:alert("bad code here")">click me</a>',
      { tags: ['a'] }
    )
    expect(result).not.toContain('bad code')
  })
})

describe('createSanitize', () => {
  it('should work without options', () => {
    const customSanitize = createSanitize()
    const result = customSanitize('hello world')
    expect(result).toBe('hello world')
  })

  it('should resolve tags from options', () => {
    const customSanitize = createSanitize({
      presets: {
        basic: ['b', 'i', 'u']
      }
    })
    const result = customSanitize('<h1>hello <u>world</u></h1>', {
      tags: ['basic']
    })
    expect(result).toBe('hello <u>world</u>')
  })

  it('should only allow specified tags', () => {
    const customSanitize = createSanitize()
    const result = customSanitize('<code><b>hello</b> world</code>', {
      tags: ['code']
    })
    expect(result).toBe('<code>hello world</code>')
  })
})
