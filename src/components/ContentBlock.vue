<script setup lang="ts">
import { computed, defineComponent, getCurrentInstance, inject, onBeforeMount, onServerPrefetch, onUpdated, ref, reactive, watch } from 'vue';
import { Block, ContentSource } from '../plugin/ContentSource';
import { findParentBlock } from '../utils/findParentBlock';
import { isBlock } from '../utils/isBlock';
import { replaceVariables } from '../utils/replaceVariables';

defineComponent({
  name: "ContentBlock"
})

const block = reactive<Block | {}>({})

const props = defineProps<{ id?: string, field?: string }>()
const parentBlock = ref<Block | undefined>()
const translate = (key: string, vars: Record<string, any>) => {
  const translation = computed(() => isBlock(block) && !isBlock(block[key]) && replaceVariables(block[key], vars))
  return translation.value
}

const currentInstance = getCurrentInstance()
const contentSource = inject<ContentSource>("content-source")
const updateValues = () => {
  if (!currentInstance || !contentSource) {
    return
  }
  if (!parentBlock.value) {
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
