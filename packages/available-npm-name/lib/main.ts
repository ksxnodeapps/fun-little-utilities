import { from } from 'rxjs'
import { share, map, mergeMap } from 'rxjs/operators'
import createLock from 'remote-controlled-promise'
import { CliArguments, Fetch, Console, Process } from './types'
import fmt from './fmt'
import { parseInput } from './parse-input'
import unit from './unit'

/** Main program */
export function main (param: main.Param): Promise<number> {
  const { argv, fetch, console, process } = param
  const registryUrl = argv.registry

  const $input = parseInput({
    args: argv._,
    stdin: process.stdin
  })
    .pipe(map(async packageName => ({
      packageName,
      status: await unit({ packageName, registryUrl, fetch })
    })))
    .pipe(mergeMap(promise => from(promise)))
    .pipe(share())

  let totalStatus = 0
  const ctrl = createLock<number>()
  $input.subscribe({
    next ({ packageName, status }) {
      totalStatus |= status
      console.info(fmt(packageName, status))
    },
    complete: () => ctrl.resolve(totalStatus),
    error: error => ctrl.reject(error)
  })
  return ctrl.promise
}

export namespace main {
  export interface Param {
    readonly argv: CliArguments
    readonly fetch: Fetch.Fn
    readonly console: Console.Mod
    readonly process: Process.Mod
  }
}

export default main
