import { inject } from "vue"
import { ContentStore } from "../plugin/ContentStore"

export const useVueContent = (path?: string) => {
    const content = inject<ContentStore>('content-store')?.resolve(path)
    return { content }
}