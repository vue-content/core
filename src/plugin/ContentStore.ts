import { d } from "dotfast"
import { ref } from "vue"
import { VueCmsOptions } from "./VueCms"

export class ContentStore {
    private store: any
    constructor(public options: VueCmsOptions) {
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
