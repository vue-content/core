import { reactive, shallowRef, ShallowRef, unref } from 'vue'
import { Block, BlockId } from './Block'
import { DefineContentReturn, LocalizedSource } from './ContentSource'
import { InMemorySource } from './InMemorySource'
import { VueContentOptions } from './options'

export class LocalizedInMemorySource<
    T extends { [L in keyof T]: BlockTree },
    BlockTree extends T[keyof T] & {}
  >
  extends InMemorySource<BlockTree>
  implements LocalizedSource<keyof T>
{
  protected currentLocale: ShallowRef<keyof T>
  protected fallbackLocale: ShallowRef<keyof T>

  constructor(locale: keyof T, protected localizedContent: T) {
    super(localizedContent[locale] as BlockTree)
    this.currentLocale = shallowRef(locale)
    this.fallbackLocale = shallowRef(locale)
  }

  public get localeRef() {
    return this.currentLocale
  }

  public get locale() {
    return unref(this.currentLocale)
  }

  public set locale(value) {
    this.currentLocale.value = value
    this.fetchContent()
  }

  public get locales() {
    return Object.keys(this.localizedContent) as (keyof T)[]
  }

  override initialize(options: VueContentOptions) {
    if (!options.locale) {
      throw new Error('No fallback locale is provided')
    }
    this.fetchContent().then(() => (this.initialized.value = true))
  }

  async fetchContent() {
    this.cache?.clear()
    this.root = this.blockify(
      this.localizedContent[this.currentLocale.value] as BlockTree,
      'root' as BlockId<BlockTree>
    )
  }
}

export function defineContent<
  T extends { [L in keyof T]: BlockTree },
  BlockTree extends T[keyof T] & {}
>(locale: keyof T, localizedContent: T) {
  const contentSource = new LocalizedInMemorySource(locale, localizedContent)
  return {
    contentSource,
    useContentBlock: contentSource.readBlock.bind(contentSource)
  } satisfies DefineContentReturn
}
