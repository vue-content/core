<script setup lang="ts">
import { defineComponent, getCurrentInstance, inject, onBeforeMount, onServerPrefetch, onUpdated, ref, reactive, watch, useSlots } from 'vue';
import { Block } from '../plugin/Block';
import { ContentSource } from '../plugin/ContentSource';
import { findParentBlock } from '../utils/findParentBlock';

defineComponent({
  name: "ContentBlock"
})

const props = withDefaults(
  defineProps<{ tag?: string, id?: string, field?: string }>(),
  {
    tag: 'div'
  }
)

const block = reactive<Block>(new Block())
const parentBlock = ref<Block | undefined>()

const translate = (field: string, vars: Record<string, any>) => {
  return block.field(field, vars)
}

const currentInstance = getCurrentInstance()
const contentSource = inject<ContentSource>("content-source")
const updateValues = () => {
  if (!currentInstance || !contentSource) {
    return
  }
  if (!parentBlock.value && currentInstance.parent) {
    parentBlock.value = findParentBlock(currentInstance.parent)
  }
  Object.assign(block, contentSource.readBlock({
    field: props.field,
    parent: parentBlock.value
  }))
}
const watchables = [
  props,
  contentSource && 'localeRef' in contentSource && contentSource?.localeRef
]
watch(watchables, updateValues)
onBeforeMount(updateValues)
onUpdated(updateValues)
onServerPrefetch(updateValues)

</script>

<template>
  <Component :is="tag" :data-cms-block="block.id">
    <slot :t="translate" :block="block"></slot>
  </Component>
</template>