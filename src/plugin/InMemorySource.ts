import { ref } from 'vue'
import { ExtendedPromise, extendPromise } from '../utils/extendPromise'
import { BaseSource } from './BaseSource'
import {
  Block,
  BlockId,
  FieldBlockQuery,
  IdBlockQuery,
  isFieldBlockQuery,
  isIdBlockQuery,
  RootFieldBlockQuery
} from './Block'

/** This is the simplest form of content source imaginable. Provide all your content as a
 * deeply nested javascript object. */
export class InMemorySource<BlockTree extends {}> extends BaseSource {
  protected root: Block<BlockTree>

  public initialized = ref(false)

  /**
   * @param content Your content as a deeply nested javascript object
   */
  constructor(content: BlockTree) {
    super()
    this.root = this.blockify(content, 'root' as BlockId<BlockTree>)
  }

  /** Skip query to get the very root block */
  readBlock(): ExtendedPromise<Block<BlockTree>>
  /** Use a query with only field to get a block directly descending from the root block */
  readBlock<F extends keyof BlockTree>(
    query: RootFieldBlockQuery<F>
  ): ExtendedPromise<Block<BlockTree[F]>>
  /** Use a query with an id to get a field by it's id */
  readBlock<P = any>(query: IdBlockQuery<P>): ExtendedPromise<Block<P>>
  /** Use a query with both parent and field to get a descendant of the parent by it's field */
  readBlock<P extends {}, F extends keyof P>(
    query: FieldBlockQuery<P, F>
  ): ExtendedPromise<Block<P[F]>>
  readBlock<P extends {}, F extends keyof P>(query?: any) {
    if (!query) {
      return extendPromise(this.root)
    }

    const parent = query.parent ?? this.root
    const id = query.id ?? `${parent.$blockMeta.id}.${String(query.field)}`

    if (this.cache?.has(`${query.type}::${id}`)) {
      return extendPromise(
        this.cache.get(`${query.type}::${id}`) as Block<P[F]>
      )
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

    return extendPromise(
      new Promise(() => {
        throw new Error(
          `The given field '${String(query.field)}' is not a block!`
        )
      })
    )
  }

  /** Use a query with an id to get a field by it's id */
  readBlocks<P = any>(query: IdBlockQuery<P>): ExtendedPromise<Block<P[]>>

  /** Use a query with only field to get blocks directly descending from the root block */
  readBlocks<F extends keyof BlockTree>(
    query: RootFieldBlockQuery<F>
  ): ExtendedPromise<BlockTree[F] extends (infer T)[] ? Block<T>[] : never>

  /** Use a query with both parent and field to get children of the parent by it's field */
  readBlocks<P extends {}, F extends keyof P>(
    query: FieldBlockQuery<P, F>
  ): ExtendedPromise<P[F] extends (infer T)[] ? Block<T>[] : never>

  readBlocks<P extends {}, F extends keyof P>(
    query: any
  ): ExtendedPromise<Block<any>[]> {
    const parent = query.parent ?? this.root

    if (isIdBlockQuery(query)) {
      const path = query.id.replace(/^root.?/, '')
      const sourceBlocks = this.getSourceBlockByPath(path, this.root) as P[]
      return extendPromise(
        sourceBlocks.map((sourceBlock, i) =>
          this.blockify(sourceBlock, `${query.id}.${i}` as BlockId<P>)
        )
      )
    }

    const children = isFieldBlockQuery<P, F>(query)
      ? parent[query.field]
      : this.root[query.field as keyof Block<BlockTree>]

    if (children && Array.isArray(children)) {
      return extendPromise(
        children.map((child, i) =>
          this.blockify(
            child,
            `${parent.$blockMeta.id}.${String(query.field)}.${i}` as BlockId<
              P[F]
            >
          )
        )
      )
    }

    return extendPromise(
      new Promise(() => {
        throw new Error(`The given field '${query.field}' is not a list!`)
      })
    )
  }

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
}

/** Define the content for your application by running this method in a separate
 * file. Then use contentSource when registering the Vue content plugin.
 *
 * @param content Your content as a deeply nested javascript object
 */
export function defineContent<BlockTree extends {}>(content: BlockTree) {
  const contentSource = new InMemorySource(content)
  return {
    contentSource,
    useContentBlock: contentSource.readBlock.bind(contentSource)
  }
}
