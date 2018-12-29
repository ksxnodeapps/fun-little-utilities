import { ActionType } from './action'
import { ConsoleDatabase } from './console'

export function getString (options: getString.Options): string {
  const { console, types, wordSeparator = ' ', lineSeparator = '\n' } = options
  const typeSet = new Set(types)

  return console
    .getActions()
    .filter(x => typeSet.has(x.type))
    .map(x => x.data.join(wordSeparator))
    .join(lineSeparator)

}

export namespace getString {
  export interface Options {
    readonly console: ConsoleDatabase
    readonly types: Iterable<ActionType>
    readonly wordSeparator?: string
    readonly lineSeparator?: string
  }
}
