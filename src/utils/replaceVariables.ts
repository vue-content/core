export const replaceVariables = (
  text: string,
  variables: Record<string, string | number> = {}
): string => {
  return text?.replace(
    /{{([^}]+)}}/g,
    (m, p1) => variables[p1.trim()]?.toLocaleString() ?? m
  )
}
