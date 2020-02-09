import { Observable, from } from 'rxjs'
import { map, mergeMap } from 'rxjs/operators'
import { Status, Fetch } from './types'
import unit from './unit'

/** Test multiple package names */
export function sequence (param: sequence.Param) {
  const { $packageName, registryUrl, fetch } = param
  return $packageName
    .pipe(map(
      async packageName => ({
        packageName,
        status: await unit({ packageName, registryUrl, fetch })
      } as sequence.Item)
    ))
    .pipe(mergeMap(promise => from(promise)))
}

export namespace sequence {
  export interface Param {
    readonly $packageName: Observable<string>
    readonly registryUrl: string
    readonly fetch: Fetch.Fn
  }

  export interface Item {
    readonly packageName: string
    readonly status: Status
  }
}

export default sequence
