/** Prune all undefined properties from object. Won't go deeper than one level. Thanks Rotareti! https://stackoverflow.com/a/38340374/829505 */
export function shallowPruneObject(obj: Record<string, unknown>) {
  Object.keys(obj).forEach(key => obj[key] === undefined && delete obj[key])
  return obj
}
