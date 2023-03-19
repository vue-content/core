import type ContentBlock from './components/ContentBlock.vue'

declare module 'vue' {
  interface GlobalComponents {
    ContentBlock: typeof ContentBlock
  }
}
