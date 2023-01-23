import { reactive, Ref, ref } from "vue"
import { Block, BlockFields } from "./Block"
import { BlockQuery, ContentSource, LocalizedSource } from "./ContentSource"
import { VueContentOptions } from "./options"

export class InMemorySource implements ContentSource {
    protected root: Block

    public readonly registry: Record<string, Block> = {}
    public initialized = ref(false)

    constructor(protected content: any) {
      this.root = new Block()
    }

    initialize(options: VueContentOptions) {
      this.root = reactive(this.blockify(this.content, "root"))
      this.initialized.value = true
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

    async updateBlock(block: Block) {
      const path = block.id.replace(/^root.?/, '')
      const source = this.getSourceBlockByPath(path)
      Object.keys(source).forEach(key => {
        if (!Array.isArray(block.fields[key]) && !(block.fields[key] instanceof Block)) {
          // For now, only handle primitive values
          source[key] = block.fields[key]
        }
      })
      return block
    }

    getSourceBlockByPath(path: string, source: any = this.content) {
      return path === ""
        ? source
        : path.split('.').reduce((accumulator, currentValue) => accumulator[currentValue], source)
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
