import { ShallowRef, Ref } from 'vue'
import { ExtendedPromise } from '../utils/extendPromise'
import { Block } from './Block'
import { VueContentOptions } from './options'

export interface ContentSource {
  initialized: Ref<boolean>
  initialize: (options: VueContentOptions) => void
  readBlock: (query?: any) => ExtendedPromise<Block<any>>
  readBlocks: (query?: any) => ExtendedPromise<Block<any>[]>
  // updateBlock: (block: Block) => Promise<Block>
}

export interface LocalizedSource<L> {
  locale: L
  readonly localeRef: ShallowRef<L>
  readonly locales: L[]
}

export const implementsContentSource = (c: any): c is ContentSource =>
  'readBlock' in c

export const implementsLocalizedContentSource = <T>(
  c: any
): c is LocalizedSource<T> =>
  c && 'locale' in c && 'localeRef' in c && 'locales' in c
