import { Status } from './types'

interface StrMap {
  [_: string]: string
}

const prefix: StrMap = {
  [Status.NetworkError]: '❓',
  [Status.InvalidName]: '👎',
  [Status.Occupied]: '❌',
  [Status.Available]: '✅'
}

const suffix: StrMap = {
  [Status.NetworkError]: 'ran into a network error',
  [Status.InvalidName]: 'is an invalid name',
  [Status.Occupied]: 'is occupied',
  [Status.Available]: 'is available'
}

/** Convert a package name and a status into a message */
export const fmt = (
  packageName: string,
  status: Status
) => `${prefix[status]} ${packageName} ${suffix[status]}`

export default fmt
