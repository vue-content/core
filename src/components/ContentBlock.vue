<script setup lang="ts">
import { ComponentInternalInstance, computed, defineComponent, getCurrentInstance, inject, onBeforeMount, onServerPrefetch, onUpdated, ref, Ref, reactive, watch } from 'vue';
import { Block, ContentSource } from '../plugin/ContentSource';
import { replaceVariables } from '../utils/replaceVariables';

defineComponent({
  name: "ContentBlock"
})

const isBlock = (block: Block | {}): block is Block => typeof block === "object" && Object.keys(block).length > 0

const block = reactive<Block | {}>({})

const findParentBlock = (node: ComponentInternalInstance): Block | undefined => {
  if (node.type.__name === "ContentBlock") {
    return isBlock(node.setupState.block)
      ? node.setupState.block as Block
      : undefined
  }
  if (node.parent) {
    return findParentBlock(node.parent)
  }
}

const props = defineProps<{ id?: string, rel?: string }>()
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
  // console.log(currentInstance)
  // console.log(parentBlock.value)
  Object.assign(block, contentSource.readBlock({
    rel: props.rel,
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
