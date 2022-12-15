export const buildPath = (el: HTMLElement, path: string): string => {
    const parent = el.parentElement
    if (!parent) {
        return path
    }
    const [key, index] = parent.dataset.contentKey?.split('=') ?? []
    path = path.replace(/\[(\w+)\]/g, (match, p1) => p1 === key ? `[${index}]` : match)
    if (parent.dataset.contentScope) {
        const arrayKey = index ? `[${index}]` : ''
        path = `${parent.dataset.contentScope}${arrayKey}.${path}`
    }
    return buildPath(parent, path)
}