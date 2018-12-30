import process from 'process'
import { spawn } from 'child_process'
import { main, ExitStatus } from 'catls-lib'
import getCliArgs from './cli-args'

const { stdout, stderr } = process
const { _: list, $0: _, ...rest } = getCliArgs()

main({
  addStatusCode: (current, addend) => current + addend,
  list,
  stdout,
  stderr,
  spawn,
  ...rest
}).then(
  status => process.exit(status),
  error => {
    console.error(error)
    return process.exit(ExitStatus.UncaughtError)
  }
)
