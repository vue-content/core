<script setup lang="ts">
import { computed, defineComponent, getCurrentInstance, inject, onBeforeMount, onServerPrefetch, onUpdated, ref, reactive, watch } from 'vue';
import { Block } from '../plugin/Block';
import { ContentSource } from '../plugin/ContentSource';
import { findParentBlock } from '../utils/findParentBlock';
import { replaceVariables } from '../utils/replaceVariables';

defineComponent({
  name: "ContentBlock"
})

const block = reactive<Block>(new Block())

const props = defineProps<{ id?: string, field?: string }>()
const parentBlock = ref<Block | undefined>()
const translate = (field: string, vars: Record<string, any>) => {
  const translation = computed(() => !(block.field(field) instanceof Block) && replaceVariables(block.field(field), vars))
  return translation.value
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
watch(() => props, updateValues)
onBeforeMount(updateValues)
onUpdated(updateValues)
onServerPrefetch(updateValues)

</script>

<template>
     <slot :t="translate" :block="block"></slot>
</template>

<style>
</style>
