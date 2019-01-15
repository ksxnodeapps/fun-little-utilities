import process from 'process'
import { spawn } from 'child_process'
import * as fsx from 'fs-extra'
import { main, ExitStatus } from 'catls-lib'
import getCliArgs from './cli-args'

const { stdout, stderr } = process
const { _: list, $0: _, ...rest } = getCliArgs()

main({
  fsPromise: fsx,
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
