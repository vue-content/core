import { replaceVariables } from "../utils/replaceVariables"

export type BlockFields = Record<string, Block | string | number>

export class Block {
  constructor(public fields: BlockFields = {}) {

  }

  field(key: string, vars: Record<string, any> = {}) {
    const content = this.fields[key]
    if(typeof content === "string") {
      return replaceVariables(content, vars)
    }
    return content
  }
}