import { App, defineAsyncComponent, Plugin, ref } from "vue";
import { d } from "dotfast"
export interface VueContentOptions {
    content: any
}

export class ContentStore {
    private store: any
    constructor(public options: VueContentOptions) {
        this.store = ref(options.content)
    }

    resolve(path?: string) {
      if (!path) {
        return this.store
      }
      return ref(d(this.store.value, path))
    }

    log() {
      console.log(this.store.value)
    }
}

export const VueContent: Plugin = {
  install: (app: App, options: VueContentOptions) => {
    const contentStore = new ContentStore(options)
    app.provide('content-store', contentStore)
    app.component("ContentText", defineAsyncComponent(() => import('../components/ContentText.vue')))
  },
};