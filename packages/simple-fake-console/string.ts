import { Action, ActionType } from './action'
import { ConsoleDatabase } from './console'

/**
 * Aggregate all `Action` of accepted `type: ActionType.WithData` into a single string
 * @note `options.console.clear()` does not affect the result
 * @param options Options
 * @returns Concatenated string from all `Action` of accepted `type: ActionType.WithData`
 */
export function getString(options: getString.Options): string {
  const { console, types, wordSeparator = ' ', lineSeparator = '\n' } = options
  const typeSet = new Set(types)

  return console
    .getActions()
    .filter((x): x is Action.WithData => typeSet.has(x.type as any))
    .map(x => x.data.join(wordSeparator))
    .join(lineSeparator)
}

export namespace getString {
  /**
   * Options to pass to `getString()`
   */
  export interface Options {
    /**
     * Provides `.getActions(): ReadonlyArray<Action>`
     */
    readonly console: ConsoleDatabase

    /**
     * Collection of accepted action types
     */
    readonly types: Iterable<ActionType.WithData>

    /**
     * Separator between words
     */
    readonly wordSeparator?: string

    /**
     * Separator between lines
     */
    readonly lineSeparator?: string
  }
}
