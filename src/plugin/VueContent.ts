import { App, Plugin } from 'vue'
import { mergeOptions } from '../utils/mergeOptions'
import { VueContentOptions } from './options'
import { contentHtmlDirective, contentTextDirective } from './directives'
import ContentBlock from '../components/ContentBlock.vue'

export function createVueContent(options: VueContentOptions) {
  return (app: App) => VueContent(app, options)
}

export function VueContent(app: App, options: VueContentOptions) {
  if (!options.source) {
    throw new Error('Please provide a content source with the source option!')
  }
  const mergedOptions = mergeOptions(options)
  const contentSource = options.source
  contentSource.initialize(mergedOptions)
  app.provide('content-source', contentSource)

  app.directive(
    'content-text',
    contentTextDirective(contentSource, mergedOptions)
  )
  app.directive('c-text', contentTextDirective(contentSource, mergedOptions))
  app.directive(
    'content-html',
    contentHtmlDirective(contentSource, mergedOptions)
  )
  app.directive('c-html', contentHtmlDirective(contentSource, mergedOptions))

  app.component('ContentBlock', ContentBlock)
}
