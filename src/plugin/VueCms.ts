import { App, defineAsyncComponent, Plugin } from "vue";
import { mergeOptions } from "../utils/mergeOptions";
import { implementsContentSource } from "./ContentSource";
import { VueCmsOptions } from "./options";
import { cmsHtmlDirective, cmsTextDirective } from "./directives";
import { InMemorySource } from "./InMemorySource";

export const VueCms: Plugin = {
  install: (app: App, options: VueCmsOptions) => {
    const contentSource = implementsContentSource(options.source) ? options.source : new InMemorySource(options.source)
    const mergedOptions = mergeOptions(options)
    app.provide('content-source', contentSource)
    app.component("ContentText", defineAsyncComponent(() => import('../components/ContentText.vue')))
    app.component("ContentBlock", defineAsyncComponent(() => import('../components/ContentBlock.vue')))
    app.component("ContentList", defineAsyncComponent(() => import('../components/ContentList.vue')))
    app.directive('cms-text', cmsTextDirective(contentSource, mergedOptions))
    app.directive('cms-html', cmsHtmlDirective(contentSource, mergedOptions))
  },
};