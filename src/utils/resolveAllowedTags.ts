import { TagOptions } from '../plugin/options'

export const resolveAllowedTags = (
  { presets, synonyms }: TagOptions,
  allowTags: string[]
): string[] => {
  return allowTags.flatMap(tag => {
    const foundSynonyms = synonyms.find(s => s.includes(tag))!
    if (foundSynonyms) {
      return foundSynonyms
    } else if (!presets[tag]) {
      return tag
    }
    const configTags = presets[tag]
    const selfReferenced = configTags.some(value => value === tag)
    if (selfReferenced) {
      return [
        tag,
        ...resolveAllowedTags(
          { presets, synonyms },
          configTags.filter(value => value !== tag)
        )
      ]
    }
    return resolveAllowedTags({ presets, synonyms }, configTags)
  })
}
