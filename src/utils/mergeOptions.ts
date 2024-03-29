import {
  defaultOptions,
  MergedOptions,
  VueContentOptions
} from '../plugin/options'

export const mergeOptions = (userOptions: VueContentOptions) => {
  const mergedOptions: MergedOptions = {
    ...defaultOptions,
    locale: userOptions.locale,
    source: userOptions.source,
    stores: userOptions.stores
  }
  if (userOptions.tags?.presets) {
    Object.assign(mergedOptions.tags.presets, userOptions.tags.presets)
  }
  return mergedOptions
}
