import { computed, DirectiveBinding, nextTick, Ref, watch } from "vue"
import { Block } from "./Block"
import { ContentSource } from "./ContentSource"
import { resolveAllowedTags } from "../utils/resolveAllowedTags"
import { VueContentOptions } from "./options"
import { sanitize } from "../utils/sanitize"
import { replaceVariables } from "../utils/replaceVariables"

interface Context {
  field: string
  block: Block
  text: Ref<string>
  options: Required<VueContentOptions>
  variables: Record<string, any>
}

export const findParentBlock = (contentSource: ContentSource, el: HTMLElement): Block | undefined => {
  const parent = el.parentElement
  const id = el.dataset.contentBlock
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
  (contentSource: ContentSource, options: VueContentOptions) => // provided when registering the directive
  (el: HTMLElement, binding: DirectiveBinding, node: any) => // provided when the directive is used
  {
    nextTick().then(() => {
      const field = getField(binding)
      const block = findParentBlock(contentSource, el)
      const variables = {}
      const text = computed(() => {
        Object.assign(variables, getVariables(node.ctx, binding))
        const content = block?.fields[field]
        return typeof content === "string"
          ? replaceVariables(content, variables)
          : ""
      })
      callback({ options, field, block, text, variables }, el, binding)
    })
  }

export const contentTextDirective = createDirective((context: Context, el: HTMLElement, binding: DirectiveBinding) => {
  el.dataset.contentField = context.field
  el.textContent = context.text.value
  context.block.fieldSettings[context.field] = {
    tags: [],
    element: el,
    singleLine: true,
    variables: context.variables
  }
  watch(context.text, () => el.textContent = context.text.value)
})

export const contentHtmlDirective = createDirective((context: Context, el: HTMLElement, binding: DirectiveBinding) => {
  el.dataset.contentField = context.field
  const modifierTags = Object.keys(binding.modifiers)
  const tags = resolveAllowedTags(context.options.tags, modifierTags.length ? modifierTags : ['default']);
  context.block.fieldSettings[context.field] = {
    tags,
    element: el,
    singleLine: el.tagName !== 'DIV',
    variables: context.variables
  }
  const setHtml = () => {
    el.innerHTML = sanitize(context.text.value, { tags })
  }
  setHtml()
  watch(context.text, setHtml)
})
