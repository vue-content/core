import { ShallowRef, Ref } from 'vue'
import { ExtendedPromise } from '../utils/ExtendedPromise'
import { Block } from './Block'
import { VueContentOptions } from './options'

export interface ContentSource {
  initialized: Ref<boolean>
  initialize: (options: VueContentOptions) => void
  useContentBlock: <T>(query?: any) => ExtendedPromise<Block<T>>
  // readBlocks: (query: BlockQuery) => Block[]
  // updateBlock: (block: Block) => Promise<Block>
}

export interface LocalizedSource<L> {
  locale: L
  readonly localeRef: ShallowRef<L>
  readonly locales: L[]
}

export const implementsContentSource = (c: any): c is ContentSource =>
  'useContentBlock' in c
