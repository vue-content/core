import { inject } from "vue"

export const useVueContent = (path?: string) => {
    const content = inject('content').get(path)
    return { content }
}