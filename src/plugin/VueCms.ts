import { App, defineAsyncComponent, Plugin } from "vue";
import { mergeOptions } from "../utils/mergeOptions";
import { ContentSource, implementsContentSource } from "./ContentSource";
import { VueCmsOptions } from "./options";
import { cmsHtmlDirective, cmsTextDirective } from "./directives";
import { InMemorySource } from "./InMemorySource";
import { LocalizedInMemorySource } from "./LocalizedInMemorySource";

const createContentSource = (options: VueCmsOptions): ContentSource => {
  if (implementsContentSource(options.source)) {
    return options.source
  }
  else if (options.locale) {
    return new LocalizedInMemorySource(options.source)
  }
  return new InMemorySource(options.source)
}

export const VueCms: Plugin = {
  install: (app: App, options: VueCmsOptions) => {
    if (!options.source) {
      throw new Error("Please provide a content source with the source option!")
    }
    const mergedOptions = mergeOptions(options)
    const contentSource = createContentSource(options)
    contentSource.initialize(mergedOptions)
    app.provide('content-source', contentSource)

    app.directive('cms-text', cmsTextDirective(contentSource, mergedOptions))
    app.directive('cms-html', cmsHtmlDirective(contentSource, mergedOptions))

    app.component("ContentText", defineAsyncComponent(() => import('../components/ContentText.vue')))
    app.component("ContentBlock", defineAsyncComponent(() => import('../components/ContentBlock.vue')))
    app.component("ContentList", defineAsyncComponent(() => import('../components/ContentList.vue')))
  },
};