import { replaceVariables } from "../utils/replaceVariables"

export type BlockField = Block | Block[] | string | number
export type BlockFields = Record<string, BlockField>

export class Block {
  constructor(public fields: BlockFields = {}) {
  }

  get id () {
    return this.fields.$id as string
  }

  field(key: string, vars: Record<string, any> = {}) {
    const content = this.fields[key]
    if(typeof content === "string") {
      return replaceVariables(content, vars)
    }
    return content
  }
}