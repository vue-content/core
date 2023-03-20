export function replaceVariables(
  text: string,
  variables: Record<string, any> = {}
): string {
  return text?.replace(/{{([^}]+)}}/g, (m, p1) => {
    return deepReplace(variables, p1) ?? m
  })
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
