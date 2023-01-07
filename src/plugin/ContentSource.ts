import { Block } from "./Block"

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
  readBlock: (query: BlockQuery) => Block
  readBlocks: (query: BlockQuery) => Block[]
}

export const implementsContentSource = (c: any): c is ContentSource => c.hasOwnProperty('readBlock');