import { ref } from 'vue'
import { Block, BlockMeta, isBlock } from "./Block"
import { VueContentOptions } from "./options"

export interface FieldBlockQuery<T extends {}> {
  parent: Block<T>
  field: keyof T
}


export interface RootFieldBlockQuery<T extends {}> {
  field: keyof T
}

export class InMemorySource<BlockTree extends {}> {
  protected root: Block<BlockTree>

  // public readonly registry: Record<string, Block> = {}
  public initialized = ref(false)
  constructor(content: BlockTree) {
    this.root = this.blockify(content, "root")
  }

  // getBlock
  //   <Key extends keyof BlockTypes>
  //   (type: Key, id: BlockId<BlockTypes[Key]>)
  //   : (Block<BlockTypes[Key]>) | undefined
  // {
  //   const blockCollection = this.content?.[type] as Array<BlockTypes[Key]> | undefined
  //   const block = blockCollection?.find((b: BlockTypes[Key]) => b.id === id)
  //   if (!block || typeof block !== "object") {
  //     return
  //   }
  //   return blockify<BlockTypes[Key]>(block, id, String(type))
  // }

  initialize(options: VueContentOptions) {
    // this.root = reactive(this.blockify(this.content, "root"))
    this.initialized.value = true
  }

  readBlock(): Block<BlockTree>
  readBlock(query: RootFieldBlockQuery<BlockTree>): Block<keyof BlockTree> 
  readBlock<P extends {}>(query: FieldBlockQuery<P>): Block<P[keyof P]> 
  readBlock<P extends {}>(query?: any) {
    if (!query) {
      return this.root
    }
    const parent = query.parent ?? this.root
    // if(query.id) {
    //   return this.registry[query.id]
    // }
    const child = parent[query.field as keyof P]
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
    // this.registry[id] = new Block({ ...fields, $id: id })
    // return this.registry[id]
    return Object.assign({}, blockInput, { $blockMeta })
  }
}
