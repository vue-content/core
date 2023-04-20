import { reactive, ref } from 'vue'
import { ExtendedPromise } from '../utils/extendPromise'
import { Block, BlockId, BlockMeta, isBlock } from './Block'
import { ContentSource } from './ContentSource'
import { MapLike, VueContentOptions } from './options'

/** Abstract class to provide a base for other content sources to inherit. */
export abstract class BaseSource implements ContentSource {
  public cache?: MapLike
  public initialized = ref(false)

  /** This method is invoked then the Vue Content plugin i initialized, do any async initialization here */
  initialize(options: VueContentOptions) {
    this.cache = options.cache ? options.cache : undefined
    this.initialized.value = true
  }

  /** Implement readBlock with a function that fetches content from your specific source. */
  abstract readBlock(query?: any): ExtendedPromise<Block<any>>

  /** Implement readBlocks with a function that fetches content from your specific source. */
  abstract readBlocks(query?: any): ExtendedPromise<Block<any>[]>

  /** Turn a javascript object into a Content block. Nothing the user should have to care about. */
  protected blockify<T extends {}>(
    blockInput: T,
    id: BlockId<T>,
    type?: string
  ): Block<T> {
    if (isBlock<T>(blockInput)) {
      return blockInput
    }
    const $blockMeta: BlockMeta<T> = {
      id,
      type,
      fieldSettings: Object.create({}),
      modifiedFields: {}
    }
    const block = reactive(Object.assign({}, blockInput, { $blockMeta }))
    this.cache?.set(`${type}::${id}`, block)
    return block
  }
}
