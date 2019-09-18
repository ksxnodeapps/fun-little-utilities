import os from 'os'
import { MainOptions } from './types'
import find from './find'
import display from './display'

export function main (options: MainOptions): number {
  const { cliOptions, logger } = options
  const { _: list, filter } = cliOptions

  const result = find(list)

  if (result.found) {
    logger.info(display(result, filter))
    return 0
  }

  return os.constants.errno.ENOENT
}

export default main
