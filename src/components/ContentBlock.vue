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

const block = ref<Block<unknown> | undefined>()
const isLoading = ref(true)
const isReady = ref(false)
const error = ref<unknown | undefined>()

const translate = (field: string, vars: Record<string, any>) => {
  // @ts-expect-error
  return replaceVariables(block[field], vars)
}

useContentSourceReader(
  getCurrentInstance(),
  props,
  async ({ contentSource, parentBlock }) => {
    try {
      error.value = undefined
      isLoading.value = true
      isReady.value = false
      const newBlock =
        !props.field && !parentBlock
          ? await contentSource.readBlock()
          : await contentSource.readBlock({
              field: props.field,
              parent: parentBlock
            })
      block.value = newBlock
      isReady.value = true
    } catch (err) {
      console.error(err)
      error.value = err
    } finally {
      isLoading.value = false
    }
  }
)
</script>

<template>
  <slot v-if="isLoading" name="loading"></slot>
  <Component v-else :is="tag" :data-content-block="block?.$blockMeta?.id">
    <slot
      :t="translate"
      :block="block"
      :isLoading="isLoading"
      :isReady="isReady"
      :error="error"
    ></slot>
  </Component>
</template>
