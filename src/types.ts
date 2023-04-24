import type ContentBlock from './components/ContentBlock.vue'
import type ContentList from './components/ContentList.vue'

declare module 'vue' {
  interface GlobalComponents {
    ContentBlock: typeof ContentBlock
    ContentList: typeof ContentList
  }
}
