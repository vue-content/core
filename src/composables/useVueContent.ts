import { inject } from "vue"
import { BlockQuery, ContentSource } from "../plugin/ContentSource"

export const useVueContent = (query: BlockQuery) => {
    const content = inject<ContentSource>('content-source')?.readBlock(query)
    return { content }
}