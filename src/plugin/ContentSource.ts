import { Ref } from 'vue'
import { Block } from './Block'
import { VueContentOptions } from './options'

export interface BlockQuery {
  field?: string
  id?: string
  parent?: Block
}

export interface BlockListQuery {
  field?: string
  id?: string
  type?: string
  parent?: Block
}

export interface ContentSource {
  initialized: Ref<boolean>
  initialize: (options: VueContentOptions) => void
  readBlock: (query: BlockQuery) => Block
  readBlocks: (query: BlockQuery) => Block[]
  updateBlock: (block: Block) => Promise<Block>
}

export interface LocalizedSource {
  locale: string
  readonly localeRef: Ref<string>
  readonly locales: string[]
}

export const implementsContentSource = (c: any): c is ContentSource =>
  'readBlock' in c
