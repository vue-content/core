import { App, defineAsyncComponent, Plugin } from "vue";
import { ContentStore } from "./ContentStore";
import { contentHtmlDirective, contentScopeDirective, contentTextDirective } from "./directives";
export interface VueCmsOptions {
    content: any
}

export const VueCms: Plugin = {
  install: (app: App, options: VueCmsOptions) => {
    const contentStore = new ContentStore(options)
    app.provide('content-store', contentStore)
    app.component("ContentText", defineAsyncComponent(() => import('../components/ContentText.vue')))
    app.directive('content-scope', contentScopeDirective)
    app.directive('content-text', contentTextDirective(contentStore))
    app.directive('content-html', contentHtmlDirective(contentStore))
  },
};