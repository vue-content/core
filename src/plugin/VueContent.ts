import { App, Plugin, ref } from "vue";

export interface VueContentOptions {
    path: string
}

class Content {
    private data: any
    constructor(public options: VueContentOptions) {
        import(options.path).then(data => this.data = ref(data))
    }

    log() {
      console.log(this.data)
    }
}

export const VueContent: Plugin = {
  install: (app: App, options: VueContentOptions) => {
    const content = new Content(options)
    app.provide('content', content)
  },
};