import { App, defineAsyncComponent, Plugin } from "vue";
import { mergeOptions } from "../utils/mergeOptions";
import { ContentSource, implementsContentSource } from "./ContentSource";
import { VueContentOptions } from "./options";
import { contentHtmlDirective, contentTextDirective } from "./directives";
import { InMemorySource } from "./InMemorySource";
import { LocalizedInMemorySource } from "./LocalizedInMemorySource";
import ContentBlock from "../components/ContentBlock.vue";
import ContentList from "../components/ContentList.vue";

const createContentSource = (options: VueContentOptions): ContentSource => {
  if (implementsContentSource(options.source)) {
    return options.source
  }
  else if (options.locale) {
    return new LocalizedInMemorySource(options.source)
  }
  return new InMemorySource(options.source)
}

export const VueContent: Plugin = {
  install: (app: App, options: VueContentOptions) => {
    if (!options.source) {
      throw new Error("Please provide a content source with the source option!")
    }
    const mergedOptions = mergeOptions(options)
    const contentSource = createContentSource(options)
    contentSource.initialize(mergedOptions)
    app.provide('content-source', contentSource)

    app.directive('content-text', contentTextDirective(contentSource, mergedOptions))
    app.directive('content-html', contentHtmlDirective(contentSource, mergedOptions))

    app.component("ContentBlock", ContentBlock)
    app.component("ContentList", ContentList)
  },
};