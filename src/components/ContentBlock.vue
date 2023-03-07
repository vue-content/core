<script setup lang="ts">
import {
  defineComponent,
  getCurrentInstance,
  onMounted,
  reactive,
  ref
} from 'vue'
import { useContentSourceReader } from '../composables/useContentSourceReader'
import { Block } from '../plugin/Block'
import { replaceVariables } from '../utils/replaceVariables'

defineComponent({
  name: 'ContentBlock'
})

const props = withDefaults(
  defineProps<{ tag?: string; id?: string; field?: string }>(),
  {
    tag: 'div'
  }
)

const block = ref<Block<any>>({})
const isLoading = ref(true)
const isReady = ref(false)

const translate = (field: string, vars: Record<string, any>) => {
  return replaceVariables(block[field], vars)
}

useContentSourceReader(
  getCurrentInstance(),
  props,
  async ({ contentSource, parentBlock }) => {
    const newBlock =
      !props.field && !parentBlock
        ? await contentSource.readBlock()
        : await contentSource.readBlock({
            field: props.field,
            parent: parentBlock
          })
    block.value = newBlock
    isLoading.value = false
    isReady.value = true
  }
)
</script>

<template>
  <slot v-if="isLoading" name="loading"></slot>
  <Component v-else :is="tag" :data-content-block="block.$blockMeta?.id">
    <slot :t="translate" :block="block" :isLoading="isLoading"></slot>
  </Component>
</template>
