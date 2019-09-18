import which from 'which'
import { FindingResult } from './types'

export function find (list: Iterable<string>): FindingResult {
  for (const word of list) {
    const path = which.sync(word, { nothrow: true })
    if (path) return { found: true, word, path }
  }

  return { found: false }
}

export default find
