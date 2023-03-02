import xss, { IFilterXSSOptions } from 'xss'

interface SanitizeOptions {
  tags?: string[]
}

export const sanitize = (text: string, { tags }: SanitizeOptions = {}) => {
  const fullWhiteList = (xss as any).whiteList
  const whiteList =
    tags === undefined
      ? fullWhiteList
      : Object.fromEntries(
          Object.entries(fullWhiteList).filter(([key, val]) =>
            tags.includes(key)
          )
        )
  const options: IFilterXSSOptions = {
    whiteList,
    stripIgnoreTag: true, // filter out all HTML not in the whitelist
    stripIgnoreTagBody: ['script'] // the script tag is a special case, we need to filter out its content
  }
  if (tags) {
    return xss(text, options)
  }
  return xss(text, options)
}
