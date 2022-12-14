<script setup lang="ts">
import { ref } from 'vue'
import { useVueContent } from '../composables/useVueContent';

const { content } = useVueContent()
const count = ref(0)
</script>

<template>
  <h1 v-content-text:title></h1>

  <div class="card">
    <ContentText tag="button" path="countResult" type="button" @click="count++">
      <template #slotName>{{ count }}</template>
    </ContentText>
    <p v-html="content.editHelloWorld"></p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Install
    <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
