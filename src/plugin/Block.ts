export interface FieldSettings {
  tags: string[]
  singleLine: boolean
  element: HTMLElement
  variables: Record<string, any>
}


export type Block<T> = T & {
  $blockMeta: BlockMeta<T>
}

export type BlockMeta<T> = {
    id: BlockId<T>
    type?: string
    modifiedFields: Partial<T>
    fieldSettings: {
      [K in keyof Partial<T>]: FieldSettings
    }
  }

export type BlockId<T> = T extends { id: unknown } ? T["id"] : string

export function isBlock <T>(block: any): block is Block<T> {
  return "$blockMeta" in block
}

export function blockify<T extends {}>(blockInput: T, id: BlockId<T>, type?: string) {
  const block: Block<T> = Object.assign({}, blockInput, {
    $blockMeta: {
      id: "id" in blockInput ? blockInput.id as BlockId<T> : id,
      type: type,
      fieldSettings: Object.create({}),
      modifiedFields: {}
    }
  })
  return block
}