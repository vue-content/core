export interface BlockQuery {
  key?: string
  parent?: Block
}

export interface BlockListQuery {
  key?: string
  id?: string
  type?: string
  parent?: Block
}

export interface Block {
  $id: string
  $type: string
  [key: string]: Block | string
}

// export class Block {
//   [key: string]: Block | string
//   constructor(public $id: string, public $type: string, public $parent: Block, properties: Record<string, Block | string>) {
//     Object.assign(this, properties)
//   }
// }

export interface ContentSource {
  readBlock: (query: BlockQuery) => Block
  // readBlocks: (query: BlockQuery) => Block[]
}

export const implementsContentSource = (c: any): c is ContentSource => c.hasOwnProperty('readBlock');