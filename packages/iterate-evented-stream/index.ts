import 'monorepo-shared-assets/.polyfill'
import AdvancedMapInitialized from 'advanced-map-initialized'
import createControlledPromise, { ControlledPromise } from 'remote-controlled-promise'

interface Undone<Value> {
  readonly done: false
  readonly value: Value
}

const undone = <Value> (value: Value): Undone<Value> => ({ done: false, value })

interface Done {
  readonly done: true
}

const done: Done = { done: true }

type State<Value> = Undone<Value> | Done

export function iterate<Chunk, Err = any> (
  stream: EventedStream<Chunk, Err>
): AsyncIterableIterator<Chunk> {
  type Controller = ControlledPromise<State<Chunk>>
  type DataEventListener = EventedStream.DataEventListener<Chunk>
  type ErrorEventListener = EventedStream.ErrorEventListener<Err>

  const promiseDict = new AdvancedMapInitialized<number, Controller>(
    Map,
    () => createControlledPromise()
  )

  {
    let promiseDictIndex = 0

    function forward (fn: (chunk: Controller) => void) {
      fn(promiseDict.get(promiseDictIndex))
      promiseDictIndex += 1
    }

    const dataListener: DataEventListener = chunk => forward(ctrl => ctrl.resolve(undone(chunk)))
    stream.addListener('data', dataListener)

    const errorListener: ErrorEventListener = err => forward(ctrl => ctrl.reject(err))
    stream.addListener('error', errorListener)

    stream.addListener('close', function listener () {
      forward(ctrl => ctrl.resolve(done))
      stream.removeListener('data', dataListener)
      stream.removeListener('error', errorListener)
      stream.removeListener('close', listener)
    })
  }

  async function * iterate (index: number): AsyncIterableIterator<Chunk> {
    const state = await promiseDict.get(index).promise
    promiseDict.delete(index)

    if (state.done) return

    yield state.value
    yield * iterate(index + 1)
  }

  return iterate(0)
}

export interface EventedStream<Chunk, Err> {
  readonly addListener: EventedStream.ListenerModifier<Chunk, Err>
  readonly removeListener: EventedStream.ListenerModifier<Chunk, Err>
}

export namespace EventedStream {
  export interface ListenerModifier<Chunk, Err> {
    (event: 'data', listener: DataEventListener<Chunk>): void
    (event: 'error', listener: ErrorEventListener<Err>): void
    (event: 'close', listener: CloseEventListener): void
  }

  export type DataEventListener<Chunk> = (chunk: Chunk) => void
  export type ErrorEventListener<Err> = (error: Err) => void
  export type CloseEventListener = () => void
}

export default iterate
