import { describe, it, expect } from 'vitest'
import { createReplaceVariables } from '../../../src/utils/createReplaceVariables'

const replaceVariables = createReplaceVariables()

describe('replaceVariables', () => {
  it('should return the given text', () => {
    expect(replaceVariables('testing testing')).toBe('testing testing')
  })

  it('should replace {{var}}', () => {
    expect(replaceVariables('hello {{var}}', { var: 'world' })).toBe(
      'hello world'
    )
  })

  it('should replace multiple variables', () => {
    const result = replaceVariables(
      'hello {{first}}, {{second}} and {{third}}',
      { first: 'one', second: 'two', third: 'three' }
    )
    expect(result).toBe('hello one, two and three')
  })

  it('should handle whitespace', () => {
    const result = replaceVariables('hello {{   padded }}', { padded: 'world' })
    expect(result).toBe('hello world')
  })

  it('should replace numbers', () => {
    const result = replaceVariables('counted to {{ count }}', { count: 3 })
    expect(result).toBe('counted to 3')
  })

  it('should not replace variables that are not found', () => {
    const result = replaceVariables('hello {{ missing }}', {})
    expect(result).toBe('hello {{ missing }}')
  })

  it('should handle undefined input', () => {
    const result = replaceVariables(undefined as unknown as string)
    expect(result).toBe(undefined)
  })

  it('should handle deep objects', () => {
    const result = replaceVariables('hello {{ store.planets.current }}', {
      store: {
        planets: {
          current: 'world'
        }
      }
    })
    expect(result).toBe('hello world')
  })
})

describe('createReplaceVariables', () => {
  it('should create a regular replaceVariables function', () => {
    const replaceVariables = createReplaceVariables()
    const result = replaceVariables('hello {{ var }}', { var: 'world' })
    expect(result).toBe('hello world')
  })

  it('should accept some base variables', () => {
    const replaceVariables = createReplaceVariables({
      var: 'world', // <-- will be used
      author: 'somebody else' // <-- will be overridden in function call
    })
    const result = replaceVariables('hello {{ var }} from {{ author }}', {
      author: 'me'
    })
    expect(result).toBe('hello world from me')
  })
})
