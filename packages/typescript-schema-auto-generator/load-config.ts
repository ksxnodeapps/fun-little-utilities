import { Result, ok, err } from '@tsfun/result'
import { PropertyPreference, addProperty, omit, deepMergeWithPreference } from '@tsfun/object'
import ensureArray from './utils/ensure-array'
import { Config } from './types'
import { FSX, Path } from './modules'
import { FileReadingFailure, FileParsingFailure, Success } from './status'

export interface ConfigLoader {
  /**
   * Should the loader accept the file?
   * @param filename Path to the file
   */
  readonly testFileName: (filename: string) => boolean

  /**
   * Parse the file
   * @param text Content of the file in text
   * @param filename Path to the file
   */
  readonly parseConfigText: (text: string, filename: string) => Result<Config, unknown>
}

export interface ConfigParseError {
  loader: ConfigLoader
  error: unknown
}

export async function loadConfigFile (param: loadConfigFile.Param): Promise<loadConfigFile.Return> {
  const { filename } = param
  const readingResult = await param.fsx.readFile(filename).then(ok, err)
  if (!readingResult.tag) return new FileReadingFailure(readingResult.error)
  const text = readingResult.value

  const parseErrors = []

  for (const loader of param.loaders) {
    if (!loader.testFileName(filename)) continue
    const parseResult = loader.parseConfigText(text, filename)
    if (parseResult.tag) return new Success(parseResult.value)
    parseErrors.push({ loader, error: parseResult.error })
  }

  return new FileParsingFailure(parseErrors)
}

export namespace loadConfigFile {
  export interface Param {
    readonly fsx: FSX.Mod
    readonly filename: string
    readonly loaders: Iterable<ConfigLoader>
  }

  export type Return =
    FileReadingFailure |
    FileParsingFailure<ConfigParseError[]> |
    Success<Config>
}

export function mergeConfig (primary: Config, ...inherited: Config[]): Config {
  const newInstruction = inherited.reduce(
    (instruction, config) => deepMergeWithPreference(
      instruction,
      omit(config.instruction, MERGE_OMITTED_KEYS),
      MERGE_CONFLICT_RESOLVER
    ),
    primary.instruction
  )
  return addProperty(primary, 'instruction', newInstruction)
}
const MERGE_OMITTED_KEYS = ['input', 'list', 'output', 'symbol'] as const
const MERGE_CONFLICT_RESOLVER = ([value]: [unknown, unknown]) =>
  value === undefined ? PropertyPreference.Right : PropertyPreference.Left

export async function loadConfig (param: loadConfig.Param): Promise<loadConfig.Return> {
  const lcfRet = await loadConfigFile(param)
  if (lcfRet.code) return lcfRet

  const config = lcfRet.value

}

export namespace loadConfig {
  export interface Param extends loadConfigFile.Param {
    readonly path: Path.Mod
  }

  export type Return =
    FileReadingFailure |
    FileParsingFailure<ConfigParseError[]>
}
