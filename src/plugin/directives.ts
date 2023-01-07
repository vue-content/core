import { computed, DirectiveBinding, nextTick, Ref, watch } from "vue"
import DOMPurify from 'isomorphic-dompurify'
import { Block } from "./Block"
import { ContentSource } from "./ContentSource"

interface Context {
  field: string
  block: Block
  text: Ref<string>
  variables: Record<string, any>
}

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
      const variables = {}
      const text = computed(() => {
        Object.assign(variables, getVariables(node.ctx, binding))
        return block?.field(field, variables)?.toString() ?? ''
      })
      callback({ field, block, text, variables }, el, binding)
    })
  }

export const cmsTextDirective = createDirective((context: Context, el: HTMLElement, binding: DirectiveBinding) => {
  el.dataset.cmsText = context.field
  el.textContent = context.text.value
  watch(context.text, () => el.textContent = context.text.value)
})

export const cmsHtmlDirective = createDirective((context: Context, el: HTMLElement, binding: DirectiveBinding) => {
  el.dataset.cmsHtml = context.field
  el.innerHTML = DOMPurify.sanitize(context.text.value)
  watch(context.text, () => el.innerHTML = DOMPurify.sanitize(context.text.value))
})
