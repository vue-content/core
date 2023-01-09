import { reactive, Ref, ref } from "vue"
import { Block } from "./Block"
import { LocalizedSource } from "./ContentSource"
import { InMemorySource } from "./InMemorySource"
import { VueContentOptions } from "./options"

export class LocalizedInMemorySource extends InMemorySource implements LocalizedSource {
    protected currentLocale: Ref<string> = ref("")
    protected fallbackLocale: Ref<string> = ref("")

    public readonly registry: Record<string, Block> = {}

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

    initialize(options: VueContentOptions) {
      if (!options.locale) {
        throw new Error("No fallback locale is provided")
      }
      this.fallbackLocale.value = options.locale
      this.currentLocale.value = options.locale
      this.fetchContent()
    }

    fetchContent() {
      this.root = reactive(this.blockify(this.content[this.currentLocale.value], "root"))
    }
}
