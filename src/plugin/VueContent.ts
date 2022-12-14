import { App, defineAsyncComponent, Plugin } from "vue";
import { ContentStore } from "./ContentStore";
export interface VueContentOptions {
    content: any
}

export const VueContent: Plugin = {
  install: (app: App, options: VueContentOptions) => {
    const contentStore = new ContentStore(options)
    app.provide('content-store', contentStore)
    app.component("ContentText", defineAsyncComponent(() => import('../components/ContentText.vue')))
  },
};