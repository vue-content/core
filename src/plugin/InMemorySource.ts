import { reactive, ref } from 'vue'
import { ExtendedPromise, extendPromise } from '../utils/extendPromise'
import {
  Block,
  BlockId,
  BlockMeta,
  FieldBlockQuery,
  IdBlockQuery,
  isBlock,
  isFieldBlockQuery,
  isIdBlockQuery,
  RootFieldBlockQuery
} from './Block'
import { ContentSource, DefineContentReturn } from './ContentSource'
import { MapLike, VueContentOptions } from './options'

export class InMemorySource<BlockTree extends {}> implements ContentSource {
  protected root: Block<BlockTree>

  public cache?: MapLike
  public initialized = ref(false)
  constructor(content: BlockTree) {
    this.root = this.blockify(content, 'root' as BlockId<BlockTree>)
  }

  initialize(options: VueContentOptions) {
    this.cache = options.cache ? options.cache : undefined
    this.initialized.value = true
  }

  readBlock(): ExtendedPromise<Block<BlockTree>>
  readBlock<F extends keyof BlockTree>(
    query: RootFieldBlockQuery<F>
  ): ExtendedPromise<Block<BlockTree[F]>>
  readBlock<P = any>(query: IdBlockQuery<P>): ExtendedPromise<Block<P>>
  readBlock<P extends {}, F extends keyof P>(
    query: FieldBlockQuery<P, F>
  ): ExtendedPromise<Block<P[F]>>
  readBlock<P extends {}, F extends keyof P>(query?: any) {
    if (!query) {
      return extendPromise(this.root)
    }

    const parent = query.parent ?? this.root
    const id = query.id ?? `${parent.$blockMeta.id}.${String(query.field)}`

    if (this.cache?.has(id)) {
      return extendPromise(this.cache.get(id) as Block<P[F]>)
    }

    if (isIdBlockQuery(query)) {
      const path = query.id.replace(/^root.?/, '')
      return extendPromise(
        this.blockify(
          this.getSourceBlockByPath(path, this.root),
          query.id
        ) as Block<P>
      )
    }

    const child = isFieldBlockQuery<P, F>(query)
      ? parent[query.field]
      : this.root[query.field as keyof Block<BlockTree>]

    if (child) {
      return extendPromise(
        this.blockify(
          child,
          `${parent.$blockMeta.id}.${String(query.field)}` as BlockId<P[F]>
        )
      )
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
    return path === ''
      ? source
      : path
          .split('.')
          .reduce(
            (accumulator, currentValue) => accumulator[currentValue],
            source
          )
  }

  blockify<T extends {}>(blockInput: T, id: BlockId<T>): Block<T> {
    if (isBlock<T>(blockInput)) {
      return blockInput
    }
    const $blockMeta: BlockMeta<T> = {
      id,
      fieldSettings: Object.create({}),
      modifiedFields: {}
    }
    const block = reactive(Object.assign({}, blockInput, { $blockMeta }))
    this.cache?.set(id, block)
    return block
  }
}

export function defineContent<BlockTree extends {}>(content: BlockTree) {
  const contentSource = new InMemorySource(content)
  return {
    contentSource,
    useContentBlock: contentSource.readBlock.bind(contentSource)
  } satisfies DefineContentReturn
}
