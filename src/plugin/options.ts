import { ContentSource } from "./ContentSource"

export interface VueCmsOptions {
    /** Either provide your content as a plain javascript object, or provide an instance of a ContentSource of your choice. */
    source: ContentSource | Object

    /** Settings related to allowed html tags in v-cms-html. */
    tags?: TagOptions
}

export interface TagOptions {
  /** Presets can contain regular html elements or reference other presets. You can override existing presets and add your own combinations to be used with v-cms-html. */
  presets: Record<string, string[]>

  /** If one of the synonyms in each group is allowed, all are allowed */
  synonyms: string[][]
}

export const defaultOptions: Required<VueCmsOptions> = {
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