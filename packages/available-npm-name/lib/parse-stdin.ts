import { trimmedChunks, iterateLines } from 'string-stream-utils'
import { Process } from './types'

/** Filter package names from stdin */
export async function * parseStdIn (stream: Process.Stream) {
  async function * stringChunks () {
    for await (const chunk of stream) {
      yield String(chunk)
    }
  }
  yield * trimmedChunks(iterateLines(stringChunks()))
}

export default parseStdIn
