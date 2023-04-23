<script setup lang="ts">
import { computed, ref } from 'vue'

const cmsIndex = ref(0)
const cmsList = ['your CMS', 'Directus', 'Strapi', 'JSON files']
const cms = computed(() => cmsList[cmsIndex.value])

setInterval(
  () =>
    cmsIndex.value >= cmsList.length - 1
      ? (cmsIndex.value = 0)
      : cmsIndex.value++,
  2000
)
</script>

<template>
  <ContentBlock field="features" class="features">
    <h2 v-content-text:title></h2>
    <div class="card-container">
      <ContentList field="cards" class="feature-card" v-slot="{ block }">
        <h3>{{ block.title }}</h3>
        <p v-content-html:details></p>
      </ContentList>
    </div>
  </ContentBlock>
</template>

<style scoped>
.card-container {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
}

:deep(.feature-card) {
  border-radius: 8px;
  padding: 2rem;
  background: #128113;
  color: white;
  text-align: left;
}
</style>
