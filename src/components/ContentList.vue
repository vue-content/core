<script setup lang="ts">
import { defineComponent, getCurrentInstance, reactive, ref } from 'vue';
import { useContentSourceReader } from '../composables/useContentSourceReader';
import { Block } from '../plugin/Block';

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

useContentSourceReader(getCurrentInstance(), props, ({ contentSource, parentBlock }) => {
  blocks.value = reactive(contentSource.readBlocks({
    field: props.field,
    parent: parentBlock.value
  }))
})

</script>

<template>
  <Component v-for="block in blocks" :is="tag" :data-cms-block="block.id" :key="block.id" v-bind="$attrs">
    <slot :t="(field: string, vars: Record<string, any>) => block.field(field, vars)" :block="block"></slot>
  </Component>
</template>