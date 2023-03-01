import { ref } from 'vue'
import { Block, BlockId, BlockMeta, FieldBlockQuery, IdBlockQuery, isBlock, isFieldBlockQuery, isIdBlockQuery, RootFieldBlockQuery } from "./Block"
import { MapLike, VueContentOptions } from "./options"

export class InMemorySource<BlockTree extends {}> {
  protected root: Block<BlockTree>

  public cache?: MapLike
  public initialized = ref(false)
  constructor(content: BlockTree) {
    this.root = this.blockify(content, "root" as BlockId<BlockTree>)
  }

  initialize(options: VueContentOptions) {
    this.cache = options.cache ? options.cache : undefined
    this.initialized.value = true
  }

  async readBlock(): Promise<Block<BlockTree>>
  async readBlock<F extends keyof BlockTree>(query: RootFieldBlockQuery<F>): Promise<Block<BlockTree[F]>>
  async readBlock<P = any>(query: IdBlockQuery<P>): Promise<Block<P>>
  async readBlock<P extends {}, F extends keyof P>(query: FieldBlockQuery<P, F>): Promise<Block<P[F]>>
  async readBlock<P extends {}, F extends keyof P>(query?: any) {
    if (!query) {
      return this.root
    }

    const parent = query.parent ?? this.root
    const id = query.id ?? `${parent.$blockMeta.id}.${String(query.field)}`

    if (this.cache?.has(id)) {
      return this.cache.get(id) as Block<P[F]>
    }

    if(isIdBlockQuery(query)) {
      const path = query.id.replace(/^root.?/, '')
      return this.blockify(this.getSourceBlockByPath(path, this.root), query.id) as Block<P>
    }

    const child = isFieldBlockQuery<P, F>(query)
      ? query.parent[query.field]
      : this.root[query.field as keyof BlockTree]

    if (child) {
      return this.blockify(child, `${parent.$blockMeta.id}.${String(query.field)}` as BlockId<P[F]>)
    }

    throw new Error(`The given field '${String(query.field)}' is not a block!`)
  }

  // readBlocks(query: BlockQuery): Block[] {
  //   const parent = query.parent ?? this.root
  //   if (!query.field) {
  //     throw new Error(`Not implemented`)
  //   }
  //   const children = parent.field(query.field)
  //   if (Array.isArray(children)) {
  //     return children
  //   }
  //   throw new Error(`The given field '${query.field}' is not a list!`)
  // }

  // async updateBlock(block: Block) {
  //   const path = block.id.replace(/^root.?/, '')
  //   const source = this.getSourceBlockByPath(path)
  //   Object.assign(source, block.modifiedFields)
  //   block.resetModifiedFields()
  //   return block
  // }

  getSourceBlockByPath(path: string, source: any = this.root) {
    return path === ""
      ? source
      : path.split('.').reduce((accumulator, currentValue) => accumulator[currentValue], source)
  }

  blockify <T extends {}>(blockInput: T, id: BlockId<T>): Block<T> {
    if (isBlock<T>(blockInput)) {
      return blockInput
    }
    const $blockMeta: BlockMeta<T> = {
      id,
      fieldSettings: Object.create({}),
      modifiedFields: {}
    }
    const block = Object.assign({}, blockInput, { $blockMeta })
    this.cache?.set(id, block)
    return block
  }
}
