import xss, { IFilterXSSOptions } from 'xss'
import { TagOptions } from '../plugin/options'
import { resolveAllowedTags } from './resolveAllowedTags'

type SanitizeOptions = {
  tags?: string[]
}

export function createSanitize(tagOptions?: TagOptions) {
  return function (text: string, sanitizeOptions: SanitizeOptions = {}) {
    const whiteList = generateWhiteList(tagOptions, sanitizeOptions?.tags)
    const options: IFilterXSSOptions = {
      whiteList,
      stripIgnoreTag: true, // filter out all HTML not in the whitelist
      stripIgnoreTagBody: ['script'] // the script tag is a special case, we need to filter out its content
    }
    return xss(text, options)
  }
}

function generateWhiteList(tagOptions?: TagOptions, allowedTags?: string[]) {
  const fullWhiteList = (xss as any).whiteList
  if (!allowedTags) {
    return fullWhiteList
  }
  const resolvedTags = tagOptions
    ? resolveAllowedTags(tagOptions, allowedTags)
    : allowedTags
  const whiteList = Object.fromEntries(
    Object.entries(fullWhiteList).filter(([key, val]) =>
      resolvedTags.includes(key)
    )
  )
  return whiteList
}
