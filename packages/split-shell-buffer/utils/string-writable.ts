import * as types from '../lib/types'

const symEncoding = Symbol('symEncoding')
const symData = Symbol('symData')

export class StringWritable implements types.Writable {
  private readonly [symEncoding]: StringWritable.Encoding
  private [symData] = ''

  constructor(options: StringWritable.ConstructorOptions = {}) {
    this[symEncoding] = options.encoding || 'utf8'
  }

  public write(buffer: Buffer): void {
    this[symData] += buffer.toString(this[symEncoding])
  }

  public toString(): string {
    return this[symData]
  }
}

export namespace StringWritable {
  export type Encoding = BufferEncoding

  export interface ConstructorOptions {
    readonly encoding?: Encoding
  }
}

export default StringWritable
