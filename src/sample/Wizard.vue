<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import { LocalizedInMemorySource } from '../plugin/LocalizedInMemorySource'

// const contentSource = inject<LocalizedInMemorySource>("content-source")!

const currentStep = ref(1)
</script>

<template>
  <ContentBlock field="wizard" class="wizard">
    <h3 v-content-text:title></h3>

    <div v-content-html="'step' + currentStep"></div>

    <div>
      <div>
        <ContentBlock field="buttons" class="buttons">
          <button
            v-if="currentStep > 1"
            @click="currentStep--"
            v-content-text:previous
          ></button>
          <span class="divider"></span>
          <button
            v-if="currentStep < 3"
            @click="currentStep++"
            v-content-text:next
          ></button>
        </ContentBlock>
      </div>
    </div>
  </ContentBlock>
</template>

<style scoped>
@import './style.css';

.wizard {
  border-radius: 8px;
  margin: 60px 0;
  padding: 30px 0;
  background: #e8e8e8;
}

.buttons {
  display: flex;
  justify-content: space-between;
  width: 90%;
  margin: 0 5%;
}
</style>
