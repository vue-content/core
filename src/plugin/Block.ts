import { replaceVariables } from "../utils/replaceVariables"

export type BlockField = Block | Block[] | string | number
export type BlockFields = Record<string, BlockField>

export interface FieldSettings {
  tags: string[]
  singleLine: boolean
  element: HTMLElement
  variables: Record<string, any>
}

export class Block {
  public fieldSettings: Record<string, FieldSettings> = {}
  public modifiedFields: Record<string, BlockField> = {}

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

  setField(key: string, text: BlockField) {
    this.fields[key] = text
    this.modifiedFields[key] = text
  }

  resetModifiedFields() {
    this.modifiedFields = {}
  }

  rawField(key: string): string {
    return String(this.fields[key])
  }
}