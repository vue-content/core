import { computed, DirectiveBinding, nextTick, Ref, watchEffect } from 'vue'
import { Block } from './Block'
import { ContentSource } from './ContentSource'
import { resolveAllowedTags } from '../utils/resolveAllowedTags'
import { VueContentOptions } from './options'
import { createSanitize } from '../utils/createSanitize'
import { createReplaceVariables } from '../utils/createReplaceVariables'
import { findParentBlock } from '../utils/findParentBlock'

interface Context {
  field: string
  block: Block<any>
  text: Ref<string>
  options: Required<VueContentOptions>
  variables: Record<string, any>
}

type Variables = Record<string, any>

const getField = (binding: DirectiveBinding): string => {
  if (typeof binding.value === 'string') {
    return binding.value
  }
  const field = binding.arg ?? binding.value?.field
  return field
}

const getVariables = (context: any, binding: DirectiveBinding) => {
  return Object.assign(
    {},
    context.setupState,
    context.props,
    typeof binding.value === 'object' ? binding.value : {}
  )
}

const createDirective =
  (
    // provided when declaring the directive
    callback: Function
  ) =>
  (
    // provided when registering the directive
    contentSource: ContentSource,
    options: VueContentOptions
  ) =>
  (
    // provided when the directive is used
    el: HTMLElement,
    binding: DirectiveBinding,
    node: any
  ) => {
    const replaceVariables = createReplaceVariables(options.stores)
    nextTick().then(() => {
      const field = getField(binding)
      const onBlockFound = (block: Block<any>) => {
        const variables: Variables = {}
        const text = computed(() => {
          Object.assign(variables, getVariables(node.ctx, binding))
          const content = block[field]
          return typeof content === 'string'
            ? replaceVariables(content, variables)
            : ''
        })
        callback({ options, field, block, text, variables }, el, binding)
      }
      if (binding.value?.block) {
        el.dataset.contentBlock = binding.value?.block.$blockMeta.id
        onBlockFound(binding.value?.block)
      } else {
        findParentBlock(contentSource, el).then(onBlockFound)
      }
    })
  }

export const contentTextDirective = createDirective(
  (context: Context, el: HTMLElement, binding: DirectiveBinding) => {
    el.dataset.contentField = context.field
    el.textContent = context.text.value
    context.block.$blockMeta.fieldSettings[context.field] = {
      tags: [],
      element: el,
      singleLine: true,
      variables: context.variables
    }
    watchEffect(() => (el.textContent = context.text.value))
  }
)

export const contentHtmlDirective = createDirective(
  (context: Context, el: HTMLElement, binding: DirectiveBinding) => {
    el.dataset.contentField = context.field
    const modifierTags = Object.keys(binding.modifiers)
    const tags = resolveAllowedTags(
      context.options.tags,
      modifierTags.length ? modifierTags : ['default']
    )
    context.block.$blockMeta.fieldSettings[context.field] = {
      tags,
      element: el,
      singleLine: el.tagName !== 'DIV',
      variables: context.variables
    }
    const sanitize = createSanitize(context.options.tags)
    watchEffect(() => {
      el.innerHTML = sanitize(context.text.value, { tags })
    })
  }
)
