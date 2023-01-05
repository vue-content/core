import { reactive } from "vue"
import { Block } from "./Block"
import { BlockQuery, ContentSource } from "./ContentSource"

const blockify = (content: Record<string, any>): Block => {
  const fields: Record<string, string | number | Block> = { ...content }
  Object.keys(content).forEach(key => {
    if (typeof content[key] === "object") {
      fields[key] = blockify(content[key])
    }
  })
  return new Block(fields)
}

export class InMemorySource implements ContentSource {
    private content: any
    constructor(content: any) {
        this.content = reactive(blockify(content))
    }

    readBlock(query: BlockQuery): Block {
      const parent = query.parent ?? this.content
      if (!query.field) {
        return parent
      }
      const child = parent.field(query.field)
      if (child instanceof Block) {
        return child
      }
      throw new Error(`The given field '${query.field}' is not a block!`)
    }
}
