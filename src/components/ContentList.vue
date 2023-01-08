<script setup lang="ts">
import { defineComponent, getCurrentInstance, inject, onBeforeMount, onServerPrefetch, onUpdated, reactive, ref, watch } from 'vue';
import { Block } from '../plugin/Block';
import { ContentSource } from '../plugin/ContentSource';
import { findParentBlock } from '../utils/findParentBlock';

defineComponent({
  name: "ContentList"
})

const props = withDefaults(
  defineProps<{ tag?: string, id?: string, field?: string }>(),
  {
    tag: 'div'
  }
)

const blocks = ref<Block[]>([])
const parentBlock = ref<Block | undefined>()

const currentInstance = getCurrentInstance()
const contentSource = inject<ContentSource>("content-source")
const updateValues = () => {
  if (!currentInstance || !contentSource) {
    return
  }
  if (!parentBlock.value && currentInstance.parent) {
    parentBlock.value = findParentBlock(currentInstance.parent)
  }
  blocks.value = reactive(contentSource.readBlocks({
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
  <Component v-for="block in blocks" :is="tag" :data-cms-block="block.id" :key="block.id" v-bind="$attrs">
    <slot :t="(field: string, vars: Record<string, any>) => block.field(field, vars)" :block="block"></slot>
  </Component>
</template>