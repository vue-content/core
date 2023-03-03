import {
  ComponentInternalInstance,
  inject,
  onServerPrefetch,
  onMounted,
  watch
} from 'vue'
import { LocalizedInMemorySource } from '../main'
import { Block } from '../plugin/Block'
import { ContentSource } from '../plugin/ContentSource'
import { findParentBlock } from '../utils/findParentBlock'

type CallbackFunction = (args: {
  parentBlock?: Block<any>
  contentSource: ContentSource
}) => void

function findParentElement(instance: any): HTMLElement | null {
  if (!instance) {
    return null
  }
  return instance.parent?.ctx.$el === instance.ctx.$el
    ? findParentElement(instance.parent)
    : instance.parent.ctx.$el
}

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
      findParentElement(currentInstance as any)
    ).then(parentBlock => {
      callback({ contentSource, parentBlock })
    })
  }
  const watchables = [
    props,
    contentSource?.initialized,
    (contentSource as LocalizedInMemorySource<any, unknown>).localeRef
  ]
  watch(watchables, updateValues)
  onMounted(updateValues)
  onServerPrefetch(updateValues)

  return {
    contentSource
  }
}
