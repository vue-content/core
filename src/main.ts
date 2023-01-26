export type { ContentSource } from "./plugin/ContentSource";

export { default as ContentBlock } from "./components/ContentBlock.vue";
export { default as ContentList } from "./components/ContentList.vue";
export { VueContent } from "./plugin/VueContent";
export { InMemorySource } from "./plugin/InMemorySource";
export { LocalizedInMemorySource } from "./plugin/LocalizedInMemorySource";
export { replaceVariables } from "./utils/replaceVariables"
export { sanitize } from "./utils/sanitize"
