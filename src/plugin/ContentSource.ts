import { ShallowRef, Ref } from 'vue'
import { ExtendedPromise } from '../utils/extendPromise'
import { Block } from './Block'
import { VueContentOptions } from './options'

export interface ContentSource {
  initialized: Ref<boolean>
  initialize: (options: VueContentOptions) => void
  readBlock: (query?: any) => ExtendedPromise<Block<any>>
  // readBlocks: (query: BlockQuery) => Block[]
  // updateBlock: (block: Block) => Promise<Block>
}

export interface LocalizedSource<L> {
  locale: L
  readonly localeRef: ShallowRef<L>
  readonly locales: L[]
}

export interface DefineContentReturn {
  contentSource: ContentSource
  useContentBlock: ContentSource['readBlock']
}

export const implementsContentSource = (c: any): c is ContentSource =>
  'readBlock' in c
