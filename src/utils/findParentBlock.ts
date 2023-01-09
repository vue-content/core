import { ComponentInternalInstance } from "vue"
import { Block } from "../plugin/Block"

export const findParentBlock = (node: ComponentInternalInstance): Block | undefined => {
  if (node.type.__name === "ContentBlock") {
    return (node as any).setupState.block instanceof Block
      ? (node as any).setupState.block as Block
      : undefined
  }
  if (node.parent) {
    return findParentBlock(node.parent)
  }
}
