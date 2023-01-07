export interface TagsConfig {
  presets: Record<string, string[]>
  synonyms: string[][]
}

export const tagsConfig: TagsConfig = {
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

export const resolveAllowedTags = ({ presets, synonyms }: TagsConfig, allowTags: string[]): string[] => {
  return allowTags.flatMap(tag => {
    const foundSynonyms = synonyms.find(s => s.includes(tag))!
    if (foundSynonyms) {
      return foundSynonyms
    }
    else if (!presets[tag]) {
      return tag
    }
    const configTags = (presets[tag])
    const selfReferenced = configTags.some(value => value === tag)
    if (selfReferenced) {
      return [tag, ...resolveAllowedTags({ presets, synonyms }, configTags.filter(value => value !== tag))]
    }
    return resolveAllowedTags({ presets, synonyms }, configTags)
  })
}