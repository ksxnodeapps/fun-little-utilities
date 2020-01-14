import { Stream, iterateLines, trimmedChunks } from 'string-stream-utils'
import { ArrayTable, ObjectTable, createObjectTable } from 'table-parser-base'

export { Stream }
export { ArrayTable, ObjectTable }
export * from 'table-parser-base'

export interface TableIterationOptions {
  readonly leftBound: boolean
  readonly rightBound: boolean
}

const horizontalLineRegex = /^[|-]+$/

export async function * iterateRows (lines: Stream, options: TableIterationOptions) {
  const { leftBound, rightBound } = options

  for await (const line of lines) {
    const trimmedLine = line.trim()
    if (horizontalLineRegex.test(trimmedLine)) continue

    const row = trimmedLine.split('|').map(x => x.trim())

    if (leftBound && row.shift() !== '') {
      throw new SyntaxError('Inconsistent left bound')
    }

    if (rightBound && row.pop() !== '') {
      throw new SyntaxError('Inconsistent right bound')
    }

    yield row
  }
}

export class MarkdownCellTable extends ArrayTable<string, string> {
  constructor (
    public readonly headers: readonly string[],
    public readonly rows: AsyncIterableIterator<readonly string[]>
  ) {
    super()
  }
}

export async function createMarkdownArrayTable (stream: Stream) {
  const lineIterator = trimmedChunks(iterateLines(stream))
  const firstLineResult = await lineIterator.next()

  if (firstLineResult.done) {
    throw new SyntaxError('Text is empty')
  }

  const headers = firstLineResult.value.split('|').map(x => x.trim())
  const leftBound = headers[0] === ''
  const rightBound = headers[headers.length - 1] === ''
  if (leftBound) headers.shift()
  if (rightBound) headers.pop()

  const rows = iterateRows(lineIterator, { leftBound, rightBound })

  return new MarkdownCellTable(headers, rows)
}

export async function createMarkdownObjectTable (stream: Stream) {
  return createObjectTable(await createMarkdownArrayTable(stream))
}
