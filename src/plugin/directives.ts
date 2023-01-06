import { computed, DirectiveBinding, nextTick, watch } from "vue"
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

const getVariablesFromContext = (context: any) => {
  return Object.assign({}, context.setupState, context.props)
}

export const cmsTextDirective = (contentSource: ContentSource) => (el: HTMLElement, binding: DirectiveBinding, node: any) => {
  nextTick().then(() => {
    const field = getField(binding)
    const block = findParentBlock(contentSource, el)
    const text = computed(() => {
      const vars = Object.assign({}, getVariablesFromContext(node.ctx), binding.value)
      return block?.field(field, vars)?.toString() ?? ''
    })
    el.textContent = text.value
    watch(text, () => el.textContent = text.value)
  })
}

export const cmsHtmlDirective = (contentSource: ContentSource) => (el: HTMLElement, binding: DirectiveBinding) => {
  nextTick().then(() => {
    // TODO
  })
}