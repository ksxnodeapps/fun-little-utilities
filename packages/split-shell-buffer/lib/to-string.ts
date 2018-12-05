import StringWritable from '../utils/string-writable'
import * as types from './types'
import write from './write'
import writeln from './writeln'

async function toString (splitter: types.Splitter, options: toString.Options = {}): Promise<string> {
  const { finalNewLine = false, ...rest } = options
  const writable = new StringWritable(rest)

  if (finalNewLine) {
    await writeln(writable, splitter)
  } else {
    await write(writable, splitter)
  }

  return writable.toString()
}

namespace toString {
  export interface Options extends StringWritable.ConstructorOptions {
    readonly finalNewLine?: boolean
  }
}

export = toString
