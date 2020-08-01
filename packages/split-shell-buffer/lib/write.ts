import SpecialCharacter from '../utils/special-character'
import * as types from './types'
import lines from './lines'

const { EndOfLine } = SpecialCharacter

export async function write(writable: types.Writable, splitter: types.Splitter): Promise<void> {
  let mkline = (line: types.Sequence): number[] => {
    mkline = line => [EndOfLine, ...line] // non-first lines have leading eol
    return [...line] // first line has no leading eol
  }

  for await (const line of lines(splitter)) {
    writable.write(Buffer.from(mkline(line)))
  }
}

export default write
