import { describe, it, expect } from 'vitest'
import { sanitize } from '../../../src/utils/sanitize'

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
