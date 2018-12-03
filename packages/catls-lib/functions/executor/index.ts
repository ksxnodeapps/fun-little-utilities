import { spawn } from 'child_process'
import { Executor } from '../../types'

function executor (dontFakeInteractive: boolean): Executor {
  if (dontFakeInteractive) return spawn

  const shEscMdl = import('shell-escape')

  return async (cmd, args) => {
    const shEsc = await shEscMdl
    const shCmd = shEsc.default([cmd, ...args])
    return spawn(
      'script',
      ['--quiet', '--append', '/dev/null', '--command', shCmd]
    )
  }
}

export = executor
