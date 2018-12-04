import { writeln, fromChildProcess } from 'split-shell-buffer'
import { ShowExecData } from '../../types'

async function showExecData (param: ShowExecData.Param): Promise<number> {
  const { cmd, args, execute, writable } = param
  const cp = await execute(cmd, args)
  const splitter = fromChildProcess(cp).withIndent(2)
  const promise = new Promise<number>(resolve => cp.once('close', resolve))
  await writeln(writable, splitter)
  return promise
}

export = showExecData
