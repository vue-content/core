import { inject } from "vue"
import { ContentSource } from "../plugin/ContentSource"

export const useContent = <T extends ContentSource>()  => {
    const contentSource = inject<T>('content-source')
    const initialized = contentSource?.initialized

    return { 
        contentSource,
        initialized
    }
}