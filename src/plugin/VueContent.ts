import { App, defineAsyncComponent, Plugin, ref } from "vue";
import { d } from "dotfast"
export interface VueContentOptions {
    content: any
}

class Content {
    private content: any
    constructor(public options: VueContentOptions) {
        this.content = ref(options.content)
    }

    resolve(path?: string) {
      if (!path) {
        return this.content
      }
      return ref(d(this.content.value, path))
    }

    log() {
      console.log(this.content.value)
    }
}

export const VueContent: Plugin = {
  install: (app: App, options: VueContentOptions) => {
    const content = new Content(options)
    app.provide('content', content)
    app.component("ContentText", defineAsyncComponent(() => import('../components/ContentText.vue')))
  },
};