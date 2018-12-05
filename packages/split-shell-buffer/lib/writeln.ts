import SpecialCharacter from '../utils/special-character'
import * as types from './types'
import lines from './lines'

const { EndOfLine } = SpecialCharacter

async function writeln (writable: types.Writable, splitter: types.Splitter): Promise<void> {
  for await (const line of lines(splitter)) {
    writable.write(Buffer.from([...line, EndOfLine]))
  }
}

export = writeln
