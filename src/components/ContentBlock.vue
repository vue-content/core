<script setup lang="ts">
import { defineComponent, getCurrentInstance, reactive } from 'vue';
import { useContentSourceReader } from '../composables/useContentSourceReader';
import { Block } from '../plugin/Block';

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

const translate = (field: string, vars: Record<string, any>) => {
  return block.field(field, vars)
}

useContentSourceReader(getCurrentInstance(), props, ({ contentSource, parentBlock }) => {
  Object.assign(block, contentSource.readBlock({
      field: props.field,
      parent: parentBlock.value
  }))
})

</script>

<template>
  <Component :is="tag" :data-cms-block="block.id">
    <slot :t="translate" :block="block"></slot>
  </Component>
</template>