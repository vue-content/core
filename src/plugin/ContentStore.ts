import { d } from "dotfast"
import { ref } from "vue"
import { VueContentOptions } from "./VueContent"

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
