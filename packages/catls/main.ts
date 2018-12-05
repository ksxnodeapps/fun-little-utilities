import process from 'process'
import { main, ExitStatus } from 'catls-lib'
import getCliArgs from './cli-args'

const { stdout, stderr } = process
const { _: list, ...rest } = getCliArgs()

main({
  addStatusCode: (current, addend) => current + addend,
  list,
  stdout,
  stderr,
  ...rest
}).then(
  status => process.exit(status),
  error => {
    console.error(error)
    return process.exit(ExitStatus.UncaughtError)
  }
)
