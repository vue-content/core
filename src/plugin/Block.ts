export type BlockFields = Record<string, Block | string | number>

export class Block {
  constructor(public fields: BlockFields = {}) {

  }

  field(key: string) {
    return this.fields[key]
  }
}