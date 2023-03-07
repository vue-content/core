import { reactive, Ref, ref } from 'vue'
import { ExtendedPromise, extendPromise } from '../utils/ExtendedPromise'
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
import { ContentSource } from './ContentSource'
import { MapLike, VueContentOptions } from './options'

export interface InMemorySource extends ContentSource {
  cache: MapLike | undefined
}

function blockify<T extends {}>(
  blockInput: T,
  id: BlockId<T>,
  cache?: MapLike
): Block<T> {
  if (isBlock<T>(blockInput)) {
    return blockInput
  }
  const $blockMeta: BlockMeta<T> = {
    id,
    fieldSettings: Object.create({}),
    modifiedFields: {}
  }
  const block = reactive(Object.assign({}, blockInput, { $blockMeta }))
  cache?.set(id, block)
  return block
}

function getSourceBlockByPath(path: string, source: Record<string, any>) {
  return path === ''
    ? source
    : path
        .split('.')
        .reduce(
          (accumulator, currentValue) => accumulator[currentValue],
          source
        )
}

export function createUseContentBlock<BlockTree extends {}>(
  root: Block<BlockTree>,
  cache: MapLike | undefined
) {
  function useContentBlock(): ExtendedPromise<Block<BlockTree>>
  function useContentBlock<F extends keyof BlockTree>(
    query: RootFieldBlockQuery<F>
  ): ExtendedPromise<Block<BlockTree[F]>>
  function useContentBlock<P = any>(
    query: IdBlockQuery<P>
  ): ExtendedPromise<Block<P>>
  function useContentBlock<P extends {}, F extends keyof P>(
    query: FieldBlockQuery<P, F>
  ): ExtendedPromise<Block<P[F]>>
  function useContentBlock<P extends {}, F extends keyof P>(query?: any) {
    if (!query) {
      return extendPromise(root)
    }

    const parent = query.parent ?? root
    const id = query.id ?? `${parent.$blockMeta.id}.${String(query.field)}`

    if (cache?.has(id)) {
      return extendPromise(cache.get(id) as Block<P[F]>)
    }

    if (isIdBlockQuery(query)) {
      const path = query.id.replace(/^root.?/, '')
      return blockify(
        getSourceBlockByPath(path, root),
        query.id,
        cache
      ) as Block<P>
    }

    const child = isFieldBlockQuery<P, F>(query)
      ? parent[query.field]
      : root[query.field as keyof Block<BlockTree>]

    if (child) {
      return extendPromise(
        blockify(
          child,
          `${parent.$blockMeta.id}.${String(query.field)}` as BlockId<P[F]>,
          cache
        )
      )
    }

    throw new Error(`The given field '${String(query.field)}' is not a block!`)
  }

  return useContentBlock
}

export function defineContent<BlockTree extends {}>(content: BlockTree) {
  const initialized = ref(false)
  let cache: MapLike | undefined

  const root = blockify(content, 'root' as BlockId<BlockTree>, cache)

  async function initialize(options: VueContentOptions) {
    cache = options.cache ? options.cache : undefined
    initialized.value = true
  }

  const useContentBlock = createUseContentBlock(root, cache)

  return {
    initialize,
    initialized,
    useContentBlock,
    cache
  } satisfies InMemorySource
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
