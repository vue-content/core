import { describe, it, expect } from 'vitest'
import { resolveAllowedTags } from '../../../src/utils/resolveAllowedTags'

describe('resolveAllowedTags', () => {
  it('should resolve the given tags if not presets', () => {
    const tags = resolveAllowedTags({}, ['b', 'i', 'u'])
    expect(tags).toContain('b')
    expect(tags).toContain('i')
    expect(tags).toContain('u')
  })

  it('should expand synonyms', () => {
    const tags = resolveAllowedTags({ synonyms: [['em', 'strong']] }, ['em'])
    expect(tags.length).toBe(2)
    expect(tags).toContain('em')
    expect(tags).toContain('strong')
  })

  it('should expand presets', () => {
    const tags = resolveAllowedTags({ presets: { default: ['b', 'i'] } }, [
      'default'
    ])
    expect(tags.length).toBe(2)
    expect(tags).toContain('b')
    expect(tags).toContain('i')
  })

  it('should expand nested presets', () => {
    const tags = resolveAllowedTags(
      {
        presets: {
          default: ['b', 'i'],
          extended: ['default', 'p', 'a']
        }
      },
      ['extended']
    )
    expect(tags.length).toBe(4)
    expect(tags).toContain('b')
    expect(tags).toContain('p')
  })

  it('should not end up in infinite loop', () => {
    const tags = resolveAllowedTags({ presets: { ol: ['ol', 'li'] } }, ['ol'])
    expect(tags.length).toBe(2)
    expect(tags).toContain('ol')
    expect(tags).toContain('li')
  })
})
