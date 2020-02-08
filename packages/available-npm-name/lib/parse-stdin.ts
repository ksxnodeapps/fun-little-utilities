import { Process } from './types'

/** Filter package names from stdin */
export async function * parseStdIn (stream: Process.Stream) {
  async function * stringChunks () {
    for await (const chunk of stream) {
      yield String(chunk)
    }
  }

  for await (const line of stringChunks()) {
    const trimmed = line.trim()
    if (trimmed) yield trimmed
  }
}

export default parseStdIn
