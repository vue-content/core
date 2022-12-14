export interface ContentTextPart {
    type: "text" | "mustache"
    value: string
}

export const splitContentText = (text: string): ContentTextPart[] => {
    const parts = []
    for (const match of text.matchAll(/(.*?)(?:{{(.*?)}}|$)/gs)) {
        parts.push({
            type: "text",
            value: match[1]
        } as ContentTextPart)
        parts.push({
            type: "mustache",
            value: match[2]?.trim()
        } as ContentTextPart)
    }
    return parts.filter(p => !!p.value)
}

if (import.meta.vitest) {
    const { describe, it, expect } = import.meta.vitest
    describe("splitContentText", () => {

        it('should return a mustache object', () => {
            const result = splitContentText("{{ test }}")
            expect(result[0].type).toBe("mustache")
            expect(result[0].value).toBe("test")
        })

        it('should return both text and mustache', () => {
            const result = splitContentText("text {{ key }}")
            expect(result[0].type).toBe("text")
            expect(result[0].value).toBe("text ")
            expect(result[1].type).toBe("mustache")
            expect(result[1].value).toBe("key")
        })

        it('should only return two mustaches', () => {
            const result = splitContentText("{{ first }}{{ second }}")
            expect(result.length).toBe(2)
            expect(result[0].type).toBe("mustache")
            expect(result[1].type).toBe("mustache")
        })

        it('should handle ending with text', () => {
            const result = splitContentText(`a {{ firstMustache }} and some more text`)
            expect(result.length).toBe(3)
            expect(result[2].type).toBe("text")
        })

        it('should handle multiline', () => {
            const result = splitContentText(`a text
            paragraph
            spanning a couple lines {{ 
                firstMustache
            }}
            a new line right here
            {{ 
                secondMustache
            }}`)
            expect(result.length).toBe(4)
        })

    })
  }