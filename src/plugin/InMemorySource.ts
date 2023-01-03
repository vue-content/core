import { reactive } from "vue"
import { Block, BlockQuery, ContentSource } from "./ContentSource"

export class InMemorySource implements ContentSource {
    private content: any
    constructor(content: any) {
        this.content = reactive(content)
    }

    readBlock(query: BlockQuery): Block {
      const parent = query.parent ?? this.content
      if (!query.rel) {
        return parent
      }
      const block = parent[query.rel]
      block.$parent = parent
      return block
    }
}
