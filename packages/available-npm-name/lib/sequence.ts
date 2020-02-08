import { EventEmitter } from 'events'
import { EventedStream, iterate } from 'iterate-evented-stream'
import { Status, Fetch } from './types'
import { MaybeAsyncIterable } from './utils'
import unit from './unit'

class Helper extends EventEmitter implements EventedStream<sequence.Item> {}

/** Test multiple package names */
export async function * sequence (param: sequence.Param) {
  const { packageNames, registryUrl, fetch } = param
  const helper = new Helper()
  async function loop () {
    let waiter: Promise<unknown> = Promise.resolve()
    for await (const packageName of packageNames) {
      const promise = unit({ packageName, registryUrl, fetch })
        .then(status => helper.emit('data', { packageName, status } as sequence.Item))
        .catch(error => helper.emit('error', error))
      waiter = waiter.finally(() => promise)
    }
    return waiter
  }
  void loop().finally(() => helper.emit('close'))
  yield * iterate<sequence.Item>(helper)
}

export namespace sequence {
  export interface Param {
    readonly packageNames: MaybeAsyncIterable<string>
    readonly registryUrl: string
    readonly fetch: Fetch.Fn
  }

  export interface Item {
    readonly packageName: string
    readonly status: Status
  }
}

export default sequence
