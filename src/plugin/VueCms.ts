import { App, defineAsyncComponent, Plugin } from "vue";
import { ContentSource, implementsContentSource } from "./ContentSource";
import { cmsHtmlDirective, cmsTextDirective } from "./directives";
import { InMemorySource } from "./InMemorySource";
export interface VueCmsOptions {
    source: ContentSource | Object
}

export const VueCms: Plugin = {
  install: (app: App, options: VueCmsOptions) => {
    const contentSource = implementsContentSource(options.source) ? options.source : new InMemorySource(options.source)
    app.provide('content-source', contentSource)
    app.component("ContentText", defineAsyncComponent(() => import('../components/ContentText.vue')))
    app.component("ContentBlock", defineAsyncComponent(() => import('../components/ContentBlock.vue')))
    app.component("ContentList", defineAsyncComponent(() => import('../components/ContentList.vue')))
    app.directive('cms-text', cmsTextDirective(contentSource))
    app.directive('cms-html', cmsHtmlDirective(contentSource))
  },
};