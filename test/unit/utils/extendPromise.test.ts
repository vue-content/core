import { describe, it, expect, beforeEach } from 'vitest'
import {
  ExtendedPromise,
  extendPromise
} from '../../../src/utils/extendPromise'
import { Equal, Expect, NotAny } from '../../typeAssertions'

let promise: Promise<string>

describe('extendPromise', () => {
  beforeEach(() => {
    promise = new Promise<string>((resolve, reject) =>
      setTimeout(() => resolve('hello world'), 0)
    )
  })

  it('should set state isLoading after loading is done', async () => {
    const extendedPromise = extendPromise(promise)
    expect(extendedPromise.isLoading.value).toBe(true)
    await extendedPromise
    expect(extendedPromise.isLoading.value).toBe(false)
  })

  it('should set state isReady after loading is done', async () => {
    const extendedPromise = extendPromise(promise)
    expect(extendedPromise.isReady.value).toBe(false)
    await extendedPromise
    expect(extendedPromise.isReady.value).toBe(true)
  })

  it('should resolve correctly', async () => {
    const extendedPromise = extendPromise(promise)
    expect(extendedPromise).not.toBe('hello world')
    const value = await extendedPromise
    expect(value).toBe('hello world')
  })

  it('should resolve correctly', async () => {
    const extendedPromise = extendPromise(promise)
    expect(extendedPromise).not.toBe('hello world')
    const value = await extendedPromise
    expect(value).toBe('hello world')
  })

  it('should set block correctly', async () => {
    const extendedPromise = extendPromise(promise)
    expect(extendedPromise.block.value).toBe(undefined)
    await extendedPromise
    expect(extendedPromise.block.value).toBe('hello world')
  })

  it('should promisify non-promises', async () => {
    const extendedPromise = extendPromise('hello world')
    expect(extendedPromise.block.value).toBe(undefined)
    await extendedPromise
    expect(extendedPromise.block.value).toBe('hello world')
  })
})
