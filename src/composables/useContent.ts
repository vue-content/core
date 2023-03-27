import { inject } from 'vue'
import { createReplaceVariables, createSanitize } from '../main'
import { ContentSource } from '../plugin/ContentSource'
import { MergedOptions } from '../plugin/options'

export const useContent = <T extends ContentSource>() => {
  const contentSource = inject<T>('content-source')
  const initialized = contentSource?.initialized
  const options = inject<MergedOptions>('content-options')
  const sanitize = createSanitize(options?.tags)
  const replaceVariables = createReplaceVariables(options?.stores)

  return {
    contentSource,
    initialized,
    sanitize,
    replaceVariables,
    options
  }
}
