import { inject } from 'vue'
import { createSanitize } from '../main'
import { ContentSource } from '../plugin/ContentSource'
import { MergedOptions } from '../plugin/options'

export const useContent = <T extends ContentSource>() => {
  const contentSource = inject<T>('content-source')
  const initialized = contentSource?.initialized
  const options = inject<MergedOptions>('content-options')
  const sanitize = createSanitize(options?.tags)

  return {
    contentSource,
    initialized,
    sanitize,
    options
  }
}
