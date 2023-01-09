import { ContentSource } from "./ContentSource"

export interface VueContentOptions {
    /** Either provide your content as a plain javascript object, or provide an instance of a ContentSource of your choice. */
    source: ContentSource | Object

    /** Settings related to allowed html tags in v-content-html. */
    tags?: TagOptions

    /** If you want support for multiple locales, specify what locale to fallback to. */
    locale?: string
}

export type MergedOptions = Required<Pick<VueContentOptions, "source" | "tags">> & Pick<VueContentOptions, "locale">

export interface TagOptions {
  /** Presets can contain regular html elements or reference other presets. You can override existing presets and add your own combinations to be used with v-content-html. */
  presets: Record<string, string[]>

  /** If one of the synonyms in each group is allowed, all are allowed */
  synonyms: string[][]
}

export const defaultOptions: MergedOptions = {
    source: {},
    tags: {
        presets: {
            default: ['h1', 'h2', 'basic', 'p', 'a'],
            plain: [],
            basic: ['i', 'u', 'b'],
            lists: ['ol', 'ul'],
            ol: ['ol', 'li'],
            ul: ['ul', 'li'],
        },
        synonyms: [
            ['i', 'em'],
            ['b', 'strong']
        ]
    }
}