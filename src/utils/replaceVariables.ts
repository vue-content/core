export const replaceVariables = (text: string, variables: Record<string, string | number> = {}): string => {
    return text?.replace(/{{([^}]+)}}/g, (m, p1) => variables[p1.trim()]?.toLocaleString() ?? m)
}

if (import.meta.vitest) {
    const { describe, it, expect } = import.meta.vitest
    describe("replaceVariables", () => {
        it('should return the given text', () => {
            expect(replaceVariables('testing testing')).toBe('testing testing')
        })

        it('should replace {{var}}', () => {
            expect(replaceVariables('hello {{var}}', { var: 'world'})).toBe('hello world')
        })

        it('should replace multiple variables', () => {
            const result = replaceVariables('hello {{first}}, {{second}} and {{third}}', { first: 'one', second: 'two', third: 'three'})
            expect(result).toBe('hello one, two and three')
        })

        it('should handle whitespace', () => {
            const result = replaceVariables('hello {{   padded }}', { padded: 'world' })
            expect(result).toBe('hello world')
        })

        it('should replace numbers', () => {
            const result = replaceVariables('counted to {{ count }}', { count: 3 })
            expect(result).toBe('counted to 3')
        })

        it('should not replace variables that are not found', () => {
            const result = replaceVariables('hello {{ missing }}', {})
            expect(result).toBe('hello {{ missing }}')
        })

        it('should handle undefined input', () => {
            const result = replaceVariables(undefined as unknown as string)
            expect(result).toBe(undefined)
        })
    })
}