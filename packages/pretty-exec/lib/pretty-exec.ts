import chalk from 'chalk'
import parseCommandArguments, { ParsingResult } from './parse-command-arguments'

export interface SpawnOptions {
  stdio: 'inherit'
}

export interface SpawnFunc<Return> {
  (command: string, args: string[], options: SpawnOptions): Return
}

export interface Printer {
  (...args: string[]): void
}

export interface StylingFunc {
  (text: string): string
}

export interface ColorSchemes {
  readonly prefix?: StylingFunc
  readonly command?: StylingFunc
  readonly argument?: StylingFunc
  readonly flag?: StylingFunc
  readonly optionKey?: StylingFunc
  readonly optionValue?: StylingFunc
}

export interface CreateOptions<SpawnReturn> {
  readonly spawn: SpawnFunc<SpawnReturn>
  readonly print: Printer
  readonly prefix?: readonly string[]
  readonly colorSchemes?: ColorSchemes
}

export interface PrettyExec<Return> {
  (command: string, ...args: string[]): Return
}

export const DEFAULT_PREFIX = ['$'] as const
export const DEFAULT_COLOR_SCHEMES: ColorSchemes = {}
export const DEFAULT_PREFIX_STYLING_FUNC: StylingFunc = chalk.dim
export const DEFAULT_ARGUMENT_STYLING_FUNC: StylingFunc = chalk
export const DEFAULT_COMMAND_STYLING_FUNC: StylingFunc = chalk.green
export const DEFAULT_FLAG_STYLING_FUNC: StylingFunc = chalk.red
export const DEFAULT_OPTION_KEY_STYLING_FUNC: StylingFunc = chalk.red
export const DEFAULT_OPTION_VALUE_STYLING_FUNC: StylingFunc = chalk
export const SPAWN_OPTIONS: SpawnOptions = { stdio: 'inherit' }

export function createPrettyExec<Return> (options: CreateOptions<Return>): PrettyExec<Return> {
  const {
    spawn,
    print,
    prefix: prefixText = DEFAULT_PREFIX,
    colorSchemes = DEFAULT_COLOR_SCHEMES
  } = options

  const {
    prefix = DEFAULT_PREFIX_STYLING_FUNC,
    command = DEFAULT_COMMAND_STYLING_FUNC,
    argument = DEFAULT_ARGUMENT_STYLING_FUNC,
    flag = DEFAULT_FLAG_STYLING_FUNC,
    optionKey = DEFAULT_OPTION_KEY_STYLING_FUNC,
    optionValue = DEFAULT_OPTION_VALUE_STYLING_FUNC
  } = colorSchemes

  return (cmd, ...args) => {
    print(
      ...prefixText.map(text => prefix(text)),
      command(cmd),
      ...parseCommandArguments(args).map(item => {
        switch (item.type) {
          case ParsingResult.Type.Argument:
            return argument(item.text)
          case ParsingResult.Type.Flag:
            return flag(item.text)
          case ParsingResult.Type.Option:
            return optionKey(item.key) + optionValue('=' + item.value)
        }
      })
    )

    return spawn(cmd, args, SPAWN_OPTIONS)
  }
}

export default createPrettyExec
