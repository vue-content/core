import {
  ComponentInternalInstance,
  inject,
  onBeforeMount,
  onServerPrefetch,
  onMounted,
  onUpdated,
  Ref,
  ref,
  watch
} from 'vue'
import { Block } from '../plugin/Block'
import { ContentSource } from '../plugin/ContentSource'
import { findParentBlock } from '../utils/findParentBlock'

type CallbackFunction = (args: {
  parentBlock?: Block<any>
  contentSource: ContentSource
}) => void

export const useContentSourceReader = (
  currentInstance: ComponentInternalInstance | null,
  props: any,
  callback: CallbackFunction
) => {
  const contentSource = inject<ContentSource>('content-source')
  const updateValues = () => {
    if (
      !currentInstance ||
      !contentSource ||
      !contentSource.initialized.value
    ) {
      return
    }
    findParentBlock(
      contentSource,
      (currentInstance as any).parent.ctx.$el
    ).then(parentBlock => {
      callback({ contentSource, parentBlock })
    })
  }
  const watchables = [props, contentSource?.initialized]
  watch(watchables, updateValues)
  onMounted(updateValues)
  onServerPrefetch(updateValues)

  return {
    contentSource
  }
}
