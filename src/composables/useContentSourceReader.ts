import {
  ComponentInternalInstance,
  inject,
  onBeforeMount,
  onServerPrefetch,
  onUpdated,
  Ref,
  ref,
  watch
} from 'vue'
import { Block } from '../plugin/Block'
import { ContentSource } from '../plugin/ContentSource'
import { findParentBlock } from '../utils/findParentBlock'

type CallbackFunction = (args: {
  parentBlock: Ref<Block | undefined>
  contentSource: ContentSource
}) => void

export const useContentSourceReader = (
  currentInstance: ComponentInternalInstance | null,
  props: any,
  callback: CallbackFunction
) => {
  const parentBlock = ref<Block | undefined>()
  const contentSource = inject<ContentSource>('content-source')
  const updateValues = () => {
    if (
      !currentInstance ||
      !contentSource ||
      !contentSource.initialized.value
    ) {
      return
    }
    if (!parentBlock.value && currentInstance.parent) {
      parentBlock.value = findParentBlock(currentInstance.parent)
    }
    callback({ contentSource, parentBlock })
  }
  const watchables = [props, contentSource?.initialized]
  watch(watchables, updateValues)
  onBeforeMount(updateValues)
  onUpdated(updateValues)
  onServerPrefetch(updateValues)

  return {
    parentBlock,
    contentSource
  }
}
