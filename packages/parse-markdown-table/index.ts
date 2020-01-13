import { CellSet, List } from 'table-parser-base'
export * from 'table-parser-base'

const getCells = (x: string) => x.split('|').map(x => x.trim())
const horizontalLineRegex = /^[|-]+$/

export class MarkdownCellTable extends CellSet<string, string> {
  constructor (text: string) {
    const trimmedText = text.trim()
    if (!trimmedText) throw new SyntaxError('Text is empty')
    const [ headerText, ...rowText ] = trimmedText.split('\n')
    const headers = getCells(headerText)
    const leftBound = headers[0] === ''
    const rightBound = headers[headers.length - 1] === ''

    const rows = rowText
      .map(x => x.trim())
      .filter(x => !horizontalLineRegex.test(x))
      .map(getCells)

    if (leftBound) {
      headers.shift()
      for (const row of rows) {
        if (row[0] !== '') throw new SyntaxError('Inconsistent left bound')
        row.shift()
      }
    }

    if (rightBound) {
      headers.pop()
      for (const row of rows) {
        if (row[row.length - 1] !== '') throw new SyntaxError('Inconsistent right bound')
        row.pop()
      }
    }

    super(headers, rows)
  }
}

export class MarkdownObjectTable extends List<string, string> {
  constructor (text: string) {
    super(new MarkdownCellTable(text))
  }
}
