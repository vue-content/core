import { DirectiveBinding, nextTick } from "vue"
import { ContentStore } from "./ContentStore"
import { buildPath } from "../utils/buildPath"

const parseShallowPath = (binding: DirectiveBinding<any>) => binding.value ?? binding.arg?.replace('-', '.')

const parseDeepPath = (el: HTMLElement, binding: DirectiveBinding<any>) => {
  const path = parseShallowPath(binding)
  return buildPath(el, path)
}

const makeEditableText = (el: HTMLElement, path: string) => {
  el.dataset.editableText = path
}

const makeEditableHtml = (el: HTMLElement, path: string) => {
  el.dataset.editableHtml = path
}

export const contentScopeDirective = (el: HTMLElement, binding: DirectiveBinding) => {
  el.dataset[`contentScope`] = parseShallowPath(binding)
}

export const contentTextDirective = (contentStore: ContentStore) => (el: HTMLElement, binding: DirectiveBinding) => {
  nextTick().then(() => {
    const path = parseDeepPath(el, binding)
    makeEditableText(el, path)
    el.textContent = contentStore.resolve(path).value
  })
}

export const contentHtmlDirective = (contentStore: ContentStore) => (el: HTMLElement, binding: DirectiveBinding) => {
  nextTick().then(() => {
    const path = parseDeepPath(el, binding)
    makeEditableHtml(el, path)
    el.innerHTML = contentStore.resolve(path).value
  })
}