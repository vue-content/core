export function createReplaceVariables(
  baseVariables: Record<string, any> = {}
) {
  return (text: string, variables: Record<string, any> = {}): string => {
    const mergedVariables = Object.assign({}, baseVariables, variables)
    return text?.replace(/{{([^}]+)}}/g, (m, p1) => {
      return deepReplace(mergedVariables, p1) ?? m
    })
  }
}

function deepReplace(
  scopedVariables: Record<string, any>,
  key: string
): string {
  const match = key.match(/^([^\.]+)\.(.+)$/)
  if (match) {
    return deepReplace(scopedVariables[match[1].trim()], match[2])
  }
  return scopedVariables[key.trim()]?.toLocaleString()
}
