import { Observable, from } from 'rxjs'
import { share, map, filter } from 'rxjs/operators'
import { getLinesFromStream } from 'line-observable-rxjs'
import { Process } from './types'

/** Create an observable of input from either cli arguments or stdin stream */
export function parseInput(param: parseInput.Param): Observable<string> {
  const { args, stdin } = param
  if (args.length) return from(args)
  const $result = getLinesFromStream(stdin)
    .pipe(map(line => line.trim()))
    .pipe(filter(x => Boolean(x)))
    .pipe(share())
  return $result
}

export namespace parseInput {
  export interface Param {
    readonly args: readonly string[]
    readonly stdin: Process.Stream
  }
}

export default parseInput
