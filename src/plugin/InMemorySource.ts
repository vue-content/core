import { reactive } from "vue"
import { Block, BlockFields } from "./Block"
import { BlockQuery, ContentSource, LocalizedSource } from "./ContentSource"
import { VueContentOptions } from "./options"

export class InMemorySource implements ContentSource {
    protected root: Block

    public readonly registry: Record<string, Block> = {}

    constructor(protected content: any) {
      this.root = new Block()
    }

    initialize(options: VueContentOptions) {
      this.root = reactive(this.blockify(this.content, "root"))
    }

    readBlock(query: BlockQuery): Block {
      const parent = query.parent ?? this.root
      if(query.id) {
        return this.registry[query.id]
      }
      if (!query.field) {
        return parent
      }
      const child = parent.field(query.field)
      if (child instanceof Block) {
        return child
      }
      throw new Error(`The given field '${query.field}' is not a block!`)
    }

    readBlocks(query: BlockQuery): Block[] {
      const parent = query.parent ?? this.root
      if (!query.field) {
        throw new Error(`Not implemented`)
      }
      const children = parent.field(query.field)
      if (Array.isArray(children)) {
        return children
      }
      throw new Error(`The given field '${query.field}' is not a list!`)
    }

    updateBlock(block: Block) {
      return this.blockify(block.fields, block.id)
    }

    blockify (content: Record<string, any>, id: string): Block {
      if (content instanceof Block) {
        return content
      }
      const fields: BlockFields = { ...content }
      Object.keys(content).forEach(key => {
        if (Array.isArray(content[key])) {
          fields[key] = content[key].map((c: BlockFields, index: number) => this.blockify(c, `${id}.${key}.${index}`))
        }
        else if (typeof content[key] === "object") {
          fields[key] = this.blockify(content[key], `${id}.${key}`)
        }
      })
      this.registry[id] = new Block({ ...fields, $id: id })
      return this.registry[id]
    }
}
