import { App, Plugin, ref } from "vue";

export interface VueContentOptions {
    content: any
}

class Content {
    private content: any
    constructor(public options: VueContentOptions) {
        this.content = ref(options.content)
    }

    log() {
      console.log(this.content.value)
    }
}

export const VueContent: Plugin = {
  install: (app: App, options: VueContentOptions) => {
    const content = new Content(options)
    app.provide('content', content)
  },
};