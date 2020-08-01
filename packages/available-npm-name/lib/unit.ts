import { resolve } from 'url'
import { Status, Fetch } from './types'
import { PKG_NAME_RGX } from './constants'

/** Test one package name */
export async function unit(param: unit.Param): Promise<Status> {
  const { packageName, registryUrl, fetch } = param
  if (!PKG_NAME_RGX.test(packageName)) return Status.InvalidName
  const encodedPackageName = encodeURIComponent(packageName)
  const packageURL = resolve(registryUrl, encodedPackageName)
  const { status } = await fetch(packageURL)
  if (status === 200) return Status.Occupied
  if (status === 404) return Status.Available
  return Status.NetworkError
}

export namespace unit {
  export interface Param {
    readonly packageName: string
    readonly registryUrl: string
    readonly fetch: Fetch.Fn
  }
}

export default unit
