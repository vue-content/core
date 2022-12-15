<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useVueContent } from '../composables/useVueContent';
import { buildPath } from '../utils/buildPath';
import { splitContentText, ContentTextPart } from '../utils/splitContentText';

export interface Props {
  path: string
  tag: string
}

const props = withDefaults(defineProps<Props>(), {
  tag: () => "span"
})

const textParts = ref<ContentTextPart[]>([])
const componentRef = ref()

onMounted(() => {
  const path = buildPath(componentRef.value, props.path)
  const { content } = useVueContent(path)
  textParts.value = splitContentText(content.value)
})
</script>

<template>
  <component :is="tag" ref="componentRef" :data-content-text="path">
    <template v-for="part in textParts">
      <slot v-if="part.type === 'mustache'" :name="part.value"></slot>
      <template v-else>{{ part.value }}</template>
    </template>
  </component>
</template>

<style>
</style>
