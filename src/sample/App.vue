<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import { LocalizedInMemorySource } from '../plugin/LocalizedInMemorySource';
import Wizard from './Wizard.vue';

const contentSource = inject<LocalizedInMemorySource>("content-source")!

const count = ref(0)
const doubleCount = computed(() => count.value * 2)

</script>

<template>
  <ContentBlock>
    <h1 v-content-text:title></h1>

    <ContentBlock field="card" class="card">
      <button type="button" @click="count++" v-content-text:countResult></button>
      <p v-content-html:editSample></p>
    </ContentBlock>

    <!-- <ContentList class="paragraph" field="paragraphs">
      <p v-content-html:value></p>
    </ContentList> -->
    <div v-content-html:moreInfo class="paragraphs"></div>
    <p v-content-text:currentLocale="{ locale: contentSource.locale }"></p>
  </ContentBlock>
  <div>
    <button v-for="locale in contentSource?.locales" @click="contentSource.locale = locale">{{ locale }}</button>
  </div>

  <Wizard />
</template>

<style scoped>
@import './style.css';

.paragraph:last-of-type p {
  color: #888;
}
</style>
