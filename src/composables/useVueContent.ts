import { inject } from "vue"
import { ContentStore } from "../plugin/VueContent"

export const useVueContent = (path?: string) => {
    const content = inject<ContentStore>('content-store')?.resolve(path)
    return { content }
}