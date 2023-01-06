import { reactive } from "vue"
import { Block } from "./Block"
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

    blockify (content: Record<string, any>): Block {
      const fields: Record<string, string | number | Block> = { ...content }
      Object.keys(content).forEach(key => {
        if (typeof content[key] === "object") {
          fields[key] = this.blockify(content[key])
        }
      })
      const id = nanoid(8)
      fields.$id = id
      this.registry[id] = new Block(fields)
      return this.registry[id]
    }
}
