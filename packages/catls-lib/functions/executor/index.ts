import { Executor } from '../../types'

export function executor(options: Executor.Options): Executor {
  const { dontFakeInteractive, spawn } = options

  if (dontFakeInteractive) return spawn

  const shQtMdl = import('shell-quote')

  return async (cmd, args) => {
    const { quote } = await shQtMdl
    const shCmd = quote([cmd, ...args])
    return spawn(
      'script',
      ['--quiet', '--append', '/dev/null', '--command', shCmd],
    )
  }
}

export default executor
