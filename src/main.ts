export { default as ContentBlock } from './components/ContentBlock.vue'
export { useContent } from './composables/useContent'
export { VueContent, createVueContent } from './plugin/VueContent'
export { BaseSource } from './plugin/BaseSource'
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
export type {
  Block,
  BlockId,
  BlockMeta,
  UntypedBlock,
  FieldSettings,
  IdBlockQuery,
  FieldBlockQuery,
  RootFieldBlockQuery
} from './plugin/Block'
export type { VueContentOptions } from './plugin/options'
export type { ExtendedPromise } from './utils/extendPromise'
export { isBlock, isFieldBlockQuery, isIdBlockQuery } from './plugin/Block'
