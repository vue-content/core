import { describe, it, expect, beforeEach } from 'vitest'
import { InMemorySource } from '../../../src/plugin/InMemorySource'
import { Equal, Expect, NotAny } from '../../typeAssertions'

class ContentSourceWrapper<T> extends InMemorySource<T> {
  getRoot() {
    return this.root
  }
}

const content = {
  test: 'hello world',
  nested: {
    deeper: 'down under',
    again: {
      foo: 'bar'
    }
  },
  nested2: {
    bar: 'baz'
  }
}

let source: ContentSourceWrapper<typeof content>

describe('InMemorySource', () => {
  beforeEach(() => {
    source = new ContentSourceWrapper(content)
  })

  describe('constructor', () => {
    it('should set root object directly', () => {
      expect(source.getRoot().test).toBe('hello world')
    })
  })

  describe('initialize', () => {
    it('should be initialized after initialize is called', async () => {
      expect(source.initialized.value).toBe(false)
      await source.initialize({ source })
      expect(source.initialized.value).toBe(true)
    })
  })

  describe('readBlock', () => {
    it('should return a block', async () => {
      const block = await source.readBlock()
      expect(block.test).toBe('hello world')
      expect(block.$blockMeta.id).toBe('root')
    })

    it('should set id, fieldSettings and modifiedFields', async () => {
      const block = await source.readBlock()
      expect(block.$blockMeta.id).not.toBe(undefined)
      expect(block.$blockMeta.fieldSettings).not.toBe(undefined)
      expect(block.$blockMeta.modifiedFields).not.toBe(undefined)
    })

    it('should set id, fieldSettings and modifiedFields', async () => {
      const block = await source.readBlock()
      expect(block.$blockMeta.id).not.toBe(undefined)
      expect(block.$blockMeta.fieldSettings).not.toBe(undefined)
      expect(block.$blockMeta.modifiedFields).not.toBe(undefined)
    })

    it('should read nested blocks by field', async () => {
      const root = await source.readBlock()
      const block = await source.readBlock({
        parent: root,
        field: 'nested'
      })
      expect(block.deeper).toBe('down under')
      expect(block.$blockMeta.id).toBe('root.nested')
      expect(block.$blockMeta.fieldSettings).not.toBe(undefined)
      expect(block.$blockMeta.modifiedFields).not.toBe(undefined)
    })

    it('should read blocks by id', async () => {
      const block = await source.readBlock<{ deeper: string }>({
        id: 'root.nested'
      })
      expect(block.deeper).toBe('down under')
      expect(block.$blockMeta.id).toBe('root.nested')
    })

    it('should use root if no parent is given', async () => {
      const block = await source.readBlock({
        field: 'nested'
      })
      expect(block.$blockMeta.id).toBe('root.nested')
      type test = Expect<Equal<(typeof block)['deeper'], string>>
      expect(block.deeper).toBe('down under')
    })

    it('should keep block in cache for future requests', async () => {
      const cache = new Map()
      source.initialize({ source, cache })
      await source.readBlock({
        field: 'nested'
      })
      const registryBlock = cache.get('undefined::root.nested') as any
      expect(registryBlock.deeper).toBe('down under')
    })

    it('should be possible to override caching', async () => {
      await source.initialize({ source, cache: null })
      await source.readBlock({
        field: 'nested'
      })
      expect(source.cache).toBe(undefined)
    })

    it('should read block from registry in future requests', async () => {
      source.initialize({ source, cache: new Map() })
      await source.readBlock({
        field: 'nested'
      })
      ;(source.cache.get('undefined::root.nested') as any).deeper = 'TAMPERED'
      const block = await source.readBlock({
        field: 'nested'
      })
      type test = Expect<Equal<(typeof block)['deeper'], string>>
      expect(block.deeper).toBe('TAMPERED')
    })
  })
})
