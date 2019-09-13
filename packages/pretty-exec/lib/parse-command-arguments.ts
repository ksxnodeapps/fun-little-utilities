import splitOnce from 'split-string-once'

export type ParsingResult =
  ParsingResult.Argument |
  ParsingResult.Flag |
  ParsingResult.Option

export namespace ParsingResult {
  export const enum Type {
    Argument = 'Argument',
    Flag = 'Flag',
    Option = 'Option'
  }

  export interface Argument {
    readonly type: Type.Argument
    readonly text: string
  }

  export interface Flag {
    readonly type: Type.Flag
    readonly text: string
  }

  export interface Option {
    readonly type: Type.Option
    readonly text: string
    readonly key: string
    readonly value: string
  }
}

export function parseSingleCommandArgument (text: string): ParsingResult {
  if (!text.startsWith('-')) {
    return { type: ParsingResult.Type.Argument, text }
  }

  const [key, value] = splitOnce(text, '=')

  if (value === undefined) {
    return { type: ParsingResult.Type.Flag, text }
  }

  return { type: ParsingResult.Type.Option, text, key, value }
}

export function parseCommandArguments (args: Iterable<string>): ParsingResult[] {
  let result = Array<ParsingResult>()
  let afterDoubleDash = false

  for (const text of args) {
    if (afterDoubleDash) {
      result.push({ type: ParsingResult.Type.Argument, text })
    } else if (text === '--') {
      result.push({ type: ParsingResult.Type.Flag, text })
      afterDoubleDash = true
    } else {
      result.push(parseSingleCommandArgument(text))
    }
  }

  return result
}

export default parseCommandArguments
