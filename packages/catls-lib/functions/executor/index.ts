import { Executor } from '../../types'

function executor (options: Executor.Options): Executor {
  const { dontFakeInteractive, spawn } = options

  if (dontFakeInteractive) return spawn

  return async (cmd, args) => {
    const { quote } = await import('shell-quote')
    const shCmd = quote([cmd, ...args])
    return spawn(
      'script',
      ['--quiet', '--append', '/dev/null', '--command', shCmd]
    )
  }
}

export = executor
