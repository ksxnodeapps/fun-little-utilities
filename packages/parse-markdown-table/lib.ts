import { CellSet, List } from 'table-parser-base'
import { Stream, iterateLines, trimmedChunks } from './utils'

export * from 'table-parser-base'
export { Stream }

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

    const row = trimmedLine.split('|')

    if (leftBound && row.shift() !== '') {
      throw new SyntaxError('Inconsistent left bound')
    }

    if (rightBound && row.pop() !== '') {
      throw new SyntaxError('Inconsistent right bound')
    }

    yield row
  }
}

export class MarkdownCellTable extends CellSet<string, string> {
  constructor (
    public readonly headers: readonly string[],
    public readonly rows: AsyncIterableIterator<readonly string[]>
  ) {
    super()
  }
}

export async function createMarkdownCellTable (stream: Stream) {
  const lineIterator = trimmedChunks(iterateLines(stream))
  const firstLineResult = await lineIterator.next()

  if (firstLineResult.done) {
    throw new SyntaxError('Text is empty')
  }

  const headers = firstLineResult.value.split('|')
    .map(x => x.trim())
    .filter(Boolean)

  const leftBound = headers[0] === ''
  const rightBound = headers[headers.length - 1] === ''
  if (leftBound) headers.shift()
  if (rightBound) headers.pop()

  const rows = iterateRows(lineIterator, { leftBound, rightBound })

  return new MarkdownCellTable(headers, rows)
}

export class MarkdownObjectTable<Title extends string>
extends List<Title, string> {}

export async function createMarkdownObjectTable (stream: Stream) {
  return new MarkdownObjectTable(await createMarkdownCellTable(stream))
}
