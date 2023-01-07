import { reactive } from "vue"
import { Block, BlockField, BlockFields } from "./Block"
import { BlockQuery, ContentSource } from "./ContentSource"
import { nanoid } from 'nanoid'


export class InMemorySource implements ContentSource {
    private content: any
    public readonly registry: Record<string, Block> = {}
    constructor(content: any) {
        this.content = reactive(this.blockify(content))
    }

    readBlock(query: BlockQuery): Block {
      const parent = query.parent ?? this.content
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
      const parent = query.parent ?? this.content
      if (!query.field) {
        return parent
      }
      const children = parent.field(query.field)
      if (Array.isArray(children)) {
        return children
      }
      throw new Error(`The given field '${query.field}' is not a list!`)
    }

    blockify (content: Record<string, any>): Block {
      const fields: BlockFields = { ...content }
      Object.keys(content).forEach(key => {
        if (Array.isArray(content[key])) {
          fields[key] = content[key].map((c: BlockFields) => this.blockify(c))
        }
        else if (typeof content[key] === "object") {
          fields[key] = this.blockify(content[key])
        }
      })
      const id = nanoid(8)
      this.registry[id] = new Block({ ...fields, $id: id })
      return this.registry[id]
    }
}
