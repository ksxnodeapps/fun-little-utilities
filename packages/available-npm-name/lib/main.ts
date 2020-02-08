import { CliArguments, Fetch, Console, Process } from './types'
import fmt from './fmt'
import parseStdIn from './parse-stdin'
import sequence from './sequence'

export async function main (param: main.Param): Promise<number> {
  const { argv, fetch, console, process } = param
  const packageNames = argv._.length
    ? argv._
    : parseStdIn(process.stdin)
  const iterator = sequence({
    packageNames,
    fetch,
    registryUrl: argv.registry
  })
  let totalStatus = 0
  for await (const { packageName, status } of iterator) {
    totalStatus |= status
    console.info(fmt(packageName, status))
  }
  return totalStatus
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
