import { describe, it, expect } from 'vitest'
import { ContentSource } from '../../../src/plugin/ContentSource'
import { findParentBlock } from '../../../src/utils/findParentBlock'

class FakeElement {
  dataset? = {}

  constructor(public id?: string, public parentNode?: FakeElement) {
    if (id) {
      this.dataset = {
        contentBlock: id
      }
    }
  }

  closest(selector: string) {
    if (this.dataset) {
      // NOTE: very naive implementation, but should work for these simple test cases
      return this
    }
    if (this.parentNode) {
      return this.parentNode.closest(selector)
    }
  }
}

const contentSource = {
  readBlock: async query => ({
    $blockMeta: {
      id: query.id
    }
  })
} as ContentSource

describe('findParentBlock', () => {
  it('should return this block', async () => {
    const el = new FakeElement('root') as unknown as HTMLElement
    const block = await findParentBlock(contentSource, el)
    expect(block.$blockMeta.id).toBe('root')
  })

  it('should return this since it has got a block id', async () => {
    const el = new FakeElement(
      'child',
      new FakeElement('root')
    ) as unknown as HTMLElement
    const block = await findParentBlock(contentSource, el)
    expect(block.$blockMeta.id).toBe('child')
  })

  it('should return parent', async () => {
    const el = new FakeElement(
      null,
      new FakeElement('root')
    ) as unknown as HTMLElement
    const block = await findParentBlock(contentSource, el)
    expect(block.$blockMeta.id).toBe('root')
  })

  it('should return grandparent', async () => {
    const el = new FakeElement(
      null,
      new FakeElement(null, new FakeElement('root'))
    ) as unknown as HTMLElement
    const block = await findParentBlock(contentSource, el)
    expect(block.$blockMeta.id).toBe('root')
  })

  it('should return closest parent', async () => {
    const el = new FakeElement(
      null,
      new FakeElement('parent', new FakeElement('root'))
    ) as unknown as HTMLElement
    const block = await findParentBlock(contentSource, el)
    expect(block.$blockMeta.id).toBe('parent')
  })
})
