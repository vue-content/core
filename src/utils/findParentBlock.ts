import { Block } from '../plugin/Block'
import { ContentSource } from '../plugin/ContentSource'

export async function findParentBlock(
  contentSource: ContentSource,
  el: HTMLElement | null
): Promise<Block<any> | undefined> {
  const closestBlockElement = el?.closest?.('[data-content-block]') as
    | HTMLElement
    | undefined
  if (!closestBlockElement) {
    return
  }
  const id = closestBlockElement.dataset.contentBlock
  if (id) {
    return await contentSource.useContentBlock({ id })
  }
  return findParentBlock(
    contentSource,
    closestBlockElement.parentNode as HTMLElement | null
  )
}
