import { inject } from "vue"

export const useVueContent = (path?: string) => {
    const content = inject('content').resolve(path)
    return { content }
}