import { Observable, from } from 'rxjs'
import { share, take, takeUntil, map, filter, mergeMap, bufferWhen } from 'rxjs/operators'
import { Process } from './types'
import fromEvent from './from-event'

export function parseInput (param: parseInput.Param): Observable<string> {
  const { args, stdin } = param
  if (args.length) return from(args)
  const $close = fromEvent<'close', void>(stdin, 'close')
    .pipe(take(1))
    .pipe(share())
  const $data = fromEvent<'data', Process.Chunk>(stdin, 'data')
    .pipe(takeUntil($close))
    .pipe(mergeMap(chunk => from([...chunk.toString()])))
    .pipe(share())
  const $buffer = $data
    .pipe(filter(x => x === '\n'))
    .pipe(share())
  const $result = $data
    .pipe(bufferWhen(() => $buffer))
    .pipe(map(chunk => chunk.join('').trim()))
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
