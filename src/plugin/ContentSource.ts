import { Ref } from "vue"
import { Block } from "./Block"
import { VueCmsOptions } from "./options"

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
  initialize: (options: VueCmsOptions) => void
  readBlock: (query: BlockQuery) => Block
  readBlocks: (query: BlockQuery) => Block[]
}

export interface LocalizedSource {
  locale: string
  readonly localeRef: Ref<string>
  readonly locales: string[]
}

export const implementsContentSource = (c: any): c is ContentSource => c.hasOwnProperty('readBlock');