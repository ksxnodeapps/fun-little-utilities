import { SpawnSyncOptions } from 'child_process'
import { DumpOptions, makeYamlText } from './make-yaml-text'
import fmtStdIO from './fmt-stdio'

export { SpawnSyncOptions }

export interface SpawnSync {
  (argv: string[], options?: SpawnSyncOptions): SpawnSync.Return
}

export namespace SpawnSync {
  export interface Return {
    readonly error?: null | Error
    readonly signal?: null | string
    readonly status?: null | number
    readonly stderr?: null | Buffer | string
    readonly stdout?: null | Buffer | string
  }
}

interface Options {
  readonly yamlOptions?: DumpOptions
  readonly spawnOptions?: SpawnSyncOptions
}

export function yamlSpawnSync (
  spawnSync: SpawnSync,
  argv: readonly string[] = [],
  options: Options = {}
) {
  const { yamlOptions, spawnOptions } = options
  const result = spawnSync(Array.from(argv), spawnOptions)
  const object = {
    error: result.error || null,
    signal: result.signal || null,
    status: result.status,
    stdout: fmtStdIO(result.stdout),
    stderr: fmtStdIO(result.stderr)
  }
  return makeYamlText(object, yamlOptions)
}

export default yamlSpawnSync
