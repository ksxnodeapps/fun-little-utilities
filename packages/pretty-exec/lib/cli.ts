import { SpawnFunc, Printer, createPrettyExec } from './pretty-exec'

export interface Writable {
  write (message: string): void
}

export interface Process {
  readonly argv: readonly string[]
}

export interface SpawnReturn<Status> {
  readonly status: Status
}

export interface CliExecEnv<Status> {
  readonly process: Process
  readonly spawn: SpawnFunc<SpawnReturn<Status>>
  readonly print: Printer
  readonly error: Printer
}

export function main<Status> (options: CliExecEnv<Status>) {
  const { process, error } = options
  const args = process.argv.slice(2)
  if (args.length < 1) {
    error('[ERROR] Command is missing')
    return -1
  }
  const prettyExec = createPrettyExec(options)
  const { status } = prettyExec(...args as [string, ...string[]])
  return status
}

export default main
