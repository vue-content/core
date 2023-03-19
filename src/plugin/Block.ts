import { UnwrapNestedRefs } from 'vue'

export interface FieldSettings {
  tags: string[]
  singleLine: boolean
  element: HTMLElement
  variables: Record<string, any>
}

export type Block<T> = UnwrapNestedRefs<
  T & {
    $blockMeta: BlockMeta<T>
  }
>

export type UntypedBlock = Block<Record<string, any>>

export type BlockMeta<T> = {
  id: BlockId<T>
  type?: string
  modifiedFields: Partial<T>
  fieldSettings: {
    [K in keyof Partial<T>]: FieldSettings
  }
}

export type BlockId<T> = T extends { id: unknown } ? T['id'] : string

export function isBlock<T>(block: any): block is Block<T> {
  return '$blockMeta' in block
}

export interface FieldBlockQuery<P extends {}, F extends keyof P> {
  parent: Block<P>
  field: F
}

export interface RootFieldBlockQuery<T> {
  field: T
}

export interface IdBlockQuery<T> {
  id: BlockId<T>
}

export function isFieldBlockQuery<P extends {}, F extends keyof P>(
  query: FieldBlockQuery<P, F> | RootFieldBlockQuery<P>
): query is FieldBlockQuery<P, F> {
  return 'parent' in query
}

export function isIdBlockQuery<T extends {}>(
  query: any
): query is IdBlockQuery<T> {
  return Boolean(query) && 'id' in query
}
