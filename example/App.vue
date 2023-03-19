<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import Wizard from './Wizard.vue'
import { contentSource } from './content'

const count = ref(0)
const doubleCount = computed(() => count.value * 2)
</script>

<template>
  <div v-if="contentSource.initialized">
    <ContentBlock>
      <h1 v-content-text:title></h1>

      <ContentBlock field="card" class="card">
        <button
          type="button"
          @click="count++"
          v-content-text:countResult
        ></button>
        <p v-content-html:editSample></p>
      </ContentBlock>

      <!-- <ContentList class="paragraph" field="paragraphs">
      <p v-content-html:value></p>
    </ContentList> -->
      <div v-content-html:moreInfo class="paragraphs"></div>
      <p v-content-text:currentLocale="{ locale: contentSource.locale }"></p>
      <div>
        <button
          v-for="locale in contentSource?.locales"
          @click="contentSource.locale = locale"
        >
          {{ locale }}
        </button>
      </div>
      <Wizard />
    </ContentBlock>

    <ContentBlock
      tag="pre"
      field="nonExistingField"
      v-slot="{ error, block, isLoading, isReady }"
    >
      <pre>
        {{ error }}
        isReady: {{ isReady }}
        isLoading: {{ isLoading }}
        block: {{ block }}
      </pre>
    </ContentBlock>
  </div>
</template>

<style scoped>
@import './style.css';

pre {
  overflow-x: scroll;
}

.paragraph:last-of-type p {
  color: #888;
}
</style>
