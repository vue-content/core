import { reactive, Ref, ref, unref } from "vue"
import { Block } from "./Block"
import { LocalizedSource } from "./ContentSource"
import { InMemorySource } from "./InMemorySource"
import { VueContentOptions } from "./options"

export class LocalizedInMemorySource extends InMemorySource implements LocalizedSource {
    protected currentLocale: Ref<string> = ref("")
    protected fallbackLocale: Ref<string> = ref("")

    public get localeRef() {
      return this.currentLocale
    }

    public get locale() {
      return this.currentLocale.value
    }

    public set locale(value) {
      this.currentLocale.value = value
      this.fetchContent()
    }

    public get locales() {
      return Object.keys(this.content)
    }

    override initialize(options: VueContentOptions) {
      if (!options.locale) {
        throw new Error("No fallback locale is provided")
      }
      this.fallbackLocale.value = options.locale
      this.currentLocale.value = options.locale
      this.fetchContent().then(() => this.initialized.value = true)
    }

    override getSourceBlockByPath(path: string) {
      return super.getSourceBlockByPath(path, this.content[unref(this.currentLocale)])
    }

    async fetchContent() {
      this.root = reactive(this.blockify(this.content[this.currentLocale.value], "root"))
    }
}
