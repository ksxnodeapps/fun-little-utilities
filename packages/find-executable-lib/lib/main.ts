import os from 'os'
import { CommandLineOptions } from './types'
import find from './find'
import display from './display'

function main (cliOptions: CommandLineOptions): number {
  const { _: list, filter } = cliOptions

  const result = find(list)

  if (result.found) {
    console.info(display(result, filter))
    return 0
  }

  return os.constants.errno.ENOENT
}

export = main
