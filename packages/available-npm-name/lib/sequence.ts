import { Status, Fetch } from './types'
import { MaybeAsyncIterable } from './utils'
import unit from './unit'

/** Test multiple package names */
export async function * sequence (param: sequence.Param): AsyncGenerator<sequence.Item, void> {
  const { packageNames, registryUrl, fetch } = param
  for await (const packageName of packageNames) {
    const status = await unit({ packageName, registryUrl, fetch })
    yield { packageName, status }
  }
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
