import { DirectiveBinding } from "vue"
import { ContentStore } from "./ContentStore"

const parseShallowPath = (binding: DirectiveBinding<any>) => binding.value ?? binding.arg?.replace('-', '.')

const makeEditableText = (el: HTMLElement, path: string) => {
  el.dataset.editableText = path
}

const afterRender = (callback: Function) => setTimeout(callback, 0)

export const contentTextDirective = (contentStore: ContentStore) => (el: HTMLElement, binding: DirectiveBinding) => {
  afterRender(() => {
    const path = parseShallowPath(binding)
    makeEditableText(el, path)
    el.textContent = contentStore.resolve(path).value
  })
}