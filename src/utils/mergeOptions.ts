import { defaultOptions, VueCmsOptions } from "../plugin/options";

export const mergeOptions = (userOptions: VueCmsOptions) => {
    const mergedOptions = defaultOptions
    mergedOptions.locale = userOptions.locale
    Object.assign(mergedOptions.source, userOptions.source)
    Object.assign(mergedOptions.tags.presets, userOptions.tags?.presets)
    return mergedOptions
}