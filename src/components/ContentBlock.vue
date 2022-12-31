<script setup lang="ts">
import { ComponentInternalInstance, computed, defineComponent, getCurrentInstance, inject, onBeforeMount, onServerPrefetch, onUpdated, ref, Ref, reactive, watch } from 'vue';
import { Block, ContentSource } from '../plugin/ContentSource';

defineComponent({
  name: "ContentBlock"
})

const block = reactive<Block>({})

const findParentBlock = (node: ComponentInternalInstance): Block | undefined => {
  if (node.type.__name === "ContentBlock") {
    return node.data.block as Block
  }
  if (node.parent) {
    return findParentBlock(node.parent)
  }
}

const props = defineProps<{ id?: string, key?: string }>()
const parentBlock = ref<Block | undefined>()
const translate = (key: string, vars: Record<string, any>) => {
  // const fullPath = computed(() => [generatedPath.value, id].join('.'))
  // const translation = computed(() => str.replace('{{count}}', vars.count))
  const translation = ref(block[key])
  return translation.value
}
const currentInstance = getCurrentInstance()
const contentSource = inject<ContentSource>("content-source")
const updateValues = () => {
  if (!currentInstance || !contentSource) {
    return
  }
  parentBlock.value ??= findParentBlock(currentInstance)
  Object.assign(block, contentSource.readBlock({
    key: props.key,
    parent: parentBlock.value
  }))
}
watch(() => props.id, updateValues)
onBeforeMount(updateValues)
onUpdated(updateValues)
onServerPrefetch(updateValues)

</script>

<template>
     <slot :t="translate"></slot>
</template>

<style>
</style>
