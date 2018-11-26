import * as types from '../lib/types'

class StringWritable implements types.Writable {
  private readonly encoding: StringWritable.Encoding
  private data = ''

  constructor (options: StringWritable.ConstructorOptions = {}) {
    this.encoding = options.encoding || 'utf8'
  }

  public write (buffer: Buffer): void {
    this.data += buffer.toString(this.encoding)
  }

  public toString (): string {
    return this.data
  }
}

namespace StringWritable {
  export type Encoding = BufferEncoding

  export interface ConstructorOptions {
    readonly encoding?: Encoding
  }
}

export = StringWritable
