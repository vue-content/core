import { computed, DirectiveBinding, nextTick, Ref, watch } from "vue"
import DOMPurify from 'isomorphic-dompurify'
import { Block } from "./Block"
import { ContentSource } from "./ContentSource"

export const findParentBlock = (contentSource: ContentSource, el: HTMLElement): Block | undefined => {
  const parent = el.parentElement
  const id = el.dataset.cmsBlock
  if (id) {
    return contentSource.readBlock({ id })
  }
  if (parent) {
    return findParentBlock(contentSource, parent)
  }
}

const getField = (binding: DirectiveBinding): string => {
  if (typeof binding.value === "string") {
    return binding.value
  }
  const field = binding.arg ?? binding.value?.field
  return field
}

const getVariables = (context: any, binding: DirectiveBinding) => {
  return Object.assign({}, context.setupState, context.props, binding.value)
}

const createDirective =
  (callback: Function) => // provided when declaring the directive
  (contentSource: ContentSource) => // provided when registering the directive
  (el: HTMLElement, binding: DirectiveBinding, node: any) => // provided when the directive is used
  {
    nextTick().then(() => {
      const field = getField(binding)
      const block = findParentBlock(contentSource, el)
      const text = computed(() => {
        const vars = getVariables(node.ctx, binding)
        return block?.field(field, vars)?.toString() ?? ''
      })
      callback(text, el, binding)
    })
  }

export const cmsTextDirective = createDirective((text: Ref<string>, el: HTMLElement, binding: DirectiveBinding) => {
  el.textContent = text.value
  watch(text, () => el.textContent = text.value)
})

export const cmsHtmlDirective = createDirective((text: Ref<string>, el: HTMLElement, binding: DirectiveBinding) => {
  el.innerHTML = DOMPurify.sanitize(text.value)
  watch(text, () => el.innerHTML = DOMPurify.sanitize(text.value))
})
