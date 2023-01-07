import { defaultOptions, VueCmsOptions } from "../plugin/defaultOptions";

export const mergeOptions = (userOptions: VueCmsOptions) => {
    const mergedOptions = defaultOptions
    Object.assign(mergedOptions.source, userOptions.source)
    Object.assign(mergedOptions.tags.presets, userOptions.tags?.presets)
    return mergedOptions
}