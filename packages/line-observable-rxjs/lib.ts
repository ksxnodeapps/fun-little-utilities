import { from, fromEventPattern } from 'rxjs'
import { mergeMap, filter, bufferWhen, share, map, takeUntil } from 'rxjs/operators'

import {
  Observable as Obs,
  OperatorFunction as OpFnXY,
  MonoTypeOperatorFunction as OpFnXX,
  EventTarget as ETrg,
  Stream,
  Chunk
} from './types'

export const characters = (): OpFnXY<Chunk, string> => mergeMap(chunk => from([...chunk.toString()]))
export const newlines = (): OpFnXX<string> => filter(x => x === '\n')
export const lines = (): OpFnXY<Chunk, string> => chunks => {
  const $char = chunks
    .pipe(characters())
    .pipe(share())
  const $eol = newlines()($char)
  return $char
    .pipe(bufferWhen(() => $eol))
    .pipe(map(chunk => chunk.join('')))
}
export const fromEvent = <Type, Info> (
  target: ETrg<Type, Info>,
  type: Type
): Obs<Info> => fromEventPattern(
  listener => target.addListener(type, listener),
  listener => target.removeListener(type, listener)
)
export const getLinesFromStream = (stream: Stream): Obs<string> =>
  fromEvent<'data', Chunk>(stream, 'data')
    .pipe(takeUntil(fromEvent<'close', void>(stream, 'close')))
    .pipe(lines())
export default getLinesFromStream
