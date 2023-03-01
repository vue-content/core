import { ref } from 'vue'
import { Block, BlockMeta, isBlock } from "./Block"
import { VueContentOptions } from "./options"

export interface FieldBlockQuery<P extends {}, F extends keyof P> {
  parent: Block<P>
  field: F
}

function isFieldBlockQuery <P extends {}, F extends keyof P>(query: FieldBlockQuery<P, F> | RootFieldBlockQuery<P>): query is FieldBlockQuery<P, F> {
  return "parent" in query
}

export interface RootFieldBlockQuery<T> {
  field: T
}

export class InMemorySource<BlockTree extends {}> {
  protected root: Block<BlockTree>

  public readonly registry: Record<string, Block<unknown>> = {}
  public initialized = ref(false)
  constructor(content: BlockTree) {
    this.root = this.blockify(content, "root")
  }

  initialize(options: VueContentOptions) {
    // this.root = reactive(this.blockify(this.content, "root"))
    this.initialized.value = true
  }

  readBlockExplicit<P extends {}, F extends keyof P>(parent: Block<P>, field: F): Block<P[F]> | undefined {
      const child = parent[field]
      if (child) {
        return this.blockify(child, `${parent.$blockMeta.id}.${String(field)}`)
      }
      return
  }


  readBlock(): Block<BlockTree>
  readBlock<F extends keyof BlockTree>(query: RootFieldBlockQuery<F>): Block<BlockTree[F]> 
  readBlock<P extends {}, F extends keyof P>(query: FieldBlockQuery<P, F>): Block<P[F]> 
  readBlock<P extends {}, F extends keyof P>(query?: any) {
    if (!query) {
      return this.root
    }
    // if(query.id) {
    //   return this.registry[query.id]
    // }
    const parent = query.parent ?? this.root
    const id = `${parent.$blockMeta.id}.${String(query.field)}`
    if (this.registry[id]) {
      return this.registry[id] as Block<P[F]>
    }
    const child = isFieldBlockQuery<P, F>(query)
      ? query.parent[query.field]
      : this.root[query.field as keyof BlockTree]
    if (child) {
      return this.blockify(child, `${parent.$blockMeta.id}.${String(query.field)}`)
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

  // getSourceBlockByPath(path: string, source: any = this.content) {
  //   return path === ""
  //     ? source
  //     : path.split('.').reduce((accumulator, currentValue) => accumulator[currentValue], source)
  // }

  blockify <T extends {}>(blockInput: T, id: string): Block<T> {
    if (isBlock<T>(blockInput)) {
      return blockInput
    }
    const $blockMeta: BlockMeta<T> = {
      id,
      fieldSettings: Object.create({}),
      modifiedFields: {}
    }
    const block = Object.assign({}, blockInput, { $blockMeta })
    this.registry[id] = block
    return block
  }
}
