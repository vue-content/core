export { default as ContentBlock } from './components/ContentBlock.vue'
export { useContent } from './composables/useContent'
export { VueContent } from './plugin/VueContent'
export { InMemorySource } from './plugin/InMemorySource'
export { LocalizedInMemorySource } from './plugin/LocalizedInMemorySource'
export {
  implementsContentSource,
  implementsLocalizedContentSource
} from './plugin/ContentSource'
export { replaceVariables } from './utils/replaceVariables'
export { sanitize } from './utils/sanitize'
export { extendPromise } from './utils/extendPromise'

export type { ContentSource } from './plugin/ContentSource'
export type { Block } from './plugin/Block'
