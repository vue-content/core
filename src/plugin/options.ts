import { ContentSource } from './ContentSource'

export interface MapLike {
  get: (key: string) => unknown
  set: (key: string, value: unknown) => void
  has: (key: string) => boolean
}

export interface VueContentOptions {
  /** Provide an instance of a ContentSource of your choice. */
  source: ContentSource

  /** Settings related to allowed html tags in v-content-html. */
  tags?: TagOptions

  /** If you want support for multiple locales, specify what locale to fallback to. */
  locale?: string

  /** By default everything is cached in a simple Map object. You can disable cache altogether by setting cache to `false`. Or if you want more control over your cache you can pass in a Map-like object like `@isaacs/ttl-cache` or `lru-cache`.  */
  cache?: MapLike | false
}

export type MergedOptions = Required<
  Pick<VueContentOptions, 'source' | 'tags' | 'cache'>
> &
  Pick<VueContentOptions, 'locale'>

export interface TagOptions {
  /** Presets can contain regular html elements or reference other presets. You can override existing presets and add your own combinations to be used with v-content-html. */
  presets: Record<string, string[]>

  /** If one of the synonyms in each group is allowed, all are allowed */
  synonyms: string[][]
}

export const defaultOptions = {
  cache: new Map(),
  tags: {
    presets: {
      default: ['h1', 'h2', 'basic', 'p', 'a'],
      plain: [],
      basic: ['i', 'u', 'b'],
      lists: ['ol', 'ul'],
      ol: ['ol', 'li'],
      ul: ['ul', 'li']
    },
    synonyms: [
      ['i', 'em'],
      ['b', 'strong']
    ]
  }
}
