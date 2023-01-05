export interface BlockQuery {
  field?: string
  parent?: Block
}

export interface BlockListQuery {
  field?: string
  id?: string
  type?: string
  parent?: Block
}

export interface Block {
  $id: string
  $type: string
  [key: string]: Block | string
}

export interface ContentSource {
  readBlock: (query: BlockQuery) => Block
  // readBlocks: (query: BlockQuery) => Block[]
}

export const implementsContentSource = (c: any): c is ContentSource => c.hasOwnProperty('readBlock');