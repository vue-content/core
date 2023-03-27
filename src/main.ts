export { default as ContentBlock } from './components/ContentBlock.vue'
export { useContent } from './composables/useContent'
export { VueContent, createVueContent } from './plugin/VueContent'
export { InMemorySource } from './plugin/InMemorySource'
export { LocalizedInMemorySource } from './plugin/LocalizedInMemorySource'
export {
  implementsContentSource,
  implementsLocalizedContentSource
} from './plugin/ContentSource'
export { createReplaceVariables } from './utils/createReplaceVariables'
export { createSanitize } from './utils/createSanitize'
export { extendPromise } from './utils/extendPromise'

export type { ContentSource } from './plugin/ContentSource'
export type { Block, UntypedBlock } from './plugin/Block'
