import { ComponentInternalInstance } from "vue"
import { Block } from "../plugin/ContentSource"
import { isBlock } from "./isBlock"

export const findParentBlock = (node: ComponentInternalInstance): Block | undefined => {
  if (node.type.__name === "ContentBlock") {
    return isBlock(node.setupState.block)
      ? node.setupState.block as Block
      : undefined
  }
  if (node.parent) {
    return findParentBlock(node.parent)
  }
}
