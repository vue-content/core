import { ShallowRef, Ref } from 'vue'
import { Block } from './Block'
import { VueContentOptions } from './options'

export interface ContentSource {
  initialized: Ref<boolean>
  initialize: (options: VueContentOptions) => void
  readBlock: (query?: any) => Promise<Block<any>>
  // readBlocks: (query: BlockQuery) => Block[]
  // updateBlock: (block: Block) => Promise<Block>
}

export interface LocalizedSource<L> {
  locale: L
  readonly localeRef: ShallowRef<L>
  readonly locales: L[]
}

export const implementsContentSource = (c: any): c is ContentSource =>
  'readBlock' in c
