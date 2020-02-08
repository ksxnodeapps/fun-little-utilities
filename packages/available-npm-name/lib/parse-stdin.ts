import { iterateLines } from 'string-stream-utils'
import { MaybeAsyncIterable } from './utils'

/** Filter package names from stdin */
export async function * parseStdIn (stream: MaybeAsyncIterable<string>) {
  for await (const line of iterateLines(stream)) {
    const trimmed = line.trim()
    if (trimmed) yield trimmed
  }
}

export default parseStdIn
