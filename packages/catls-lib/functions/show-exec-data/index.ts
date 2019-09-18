import { writeln, fromChildProcess } from 'split-shell-buffer'
import event2promise from 'ts-await-event'
import { ShowExecData } from '../../types'

export async function showExecData (param: ShowExecData.Param): Promise<number> {
  const { cmd, args, execute, writable } = param
  const cp = await execute(cmd, args)
  const splitter = fromChildProcess(cp).withIndent(2)
  const promise = event2promise(cp, 'close')
  await writeln(writable, splitter)
  return promise
}

export default showExecData
