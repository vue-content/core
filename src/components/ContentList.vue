<script setup lang="ts">
import { defineComponent, getCurrentInstance, ref } from 'vue'
import { useContentSourceReader } from '../composables/useContentSourceReader'
import { useContent } from '../composables/useContent'
import { Block } from '../plugin/Block'
import { shallowPruneObject } from '../utils/shallowPruneObject'

defineComponent({
  name: 'ContentList'
})

const props = withDefaults(
  defineProps<{ tag?: string; id?: string; field?: string; type?: string }>(),
  {
    tag: 'div'
  }
)

const blocks = ref<Block<unknown>[] | undefined>()
const isLoading = ref(true)
const isReady = ref(false)
const error = ref<unknown | undefined>()

useContentSourceReader(
  getCurrentInstance(),
  props,
  async ({ contentSource, parentBlock }) => {
    try {
      error.value = undefined
      isLoading.value = true
      isReady.value = false
      if (!props.id && !props.field) {
        blocks.value = await contentSource.readBlocks()
      } else {
        const query = shallowPruneObject({
          id: props.id,
          field: props.field,
          type: props.type,
          parent: parentBlock
        })
        blocks.value = await contentSource.readBlocks(query)
      }
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
  <Component
    v-else
    v-for="block in blocks"
    v-bind="$attrs"
    :is="tag"
    :data-content-block="block?.$blockMeta?.id"
    :data-content-type="block?.$blockMeta?.type"
  >
    <slot
      :block="block"
      :isLoading="isLoading"
      :isReady="isReady"
      :error="error"
    ></slot>
  </Component>
</template>
