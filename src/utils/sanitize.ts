import DOMPurify from "isomorphic-dompurify"

interface SanitizeOptions {
    tags?: string[]
}

export const sanitize = (text: string, { tags }: SanitizeOptions = {}) => {
    if (tags) {
        return DOMPurify.sanitize(text, { ALLOWED_TAGS: tags })
    }
    return DOMPurify.sanitize(text)
}