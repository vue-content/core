<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useVueContent } from '../composables/useVueContent';
import { splitContentText, ContentTextPart } from '../utils/splitContentText';

export interface Props {
  path: string
  tag: string
}

const props = withDefaults(defineProps<Props>(), {
  tag: () => "span"
})

const textParts = ref<ContentTextPart[]>([])

onMounted(() => {
  const { content } = useVueContent(props.path)
  textParts.value = splitContentText(content.value)
})
</script>

<template>
  <component :is="tag" :data-content-text="path">
    <template v-for="part in textParts">
      <slot v-if="part.type === 'mustache'" :name="part.value"></slot>
      <template v-else>{{ part.value }}</template>
    </template>
  </component>
</template>

<style>
</style>
