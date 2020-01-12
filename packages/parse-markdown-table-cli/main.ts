import process from 'process'
import yargs from 'yargs'
import getStdIn from 'get-stdin'
import { RowType, IndentType, Status, main } from './'

process.argv[0] = 'parse-markdown-table'

const { argv } = yargs
  .option('rowType', {
    describe: 'Structure of rows',
    choices: [RowType.List, RowType.Dict],
    default: RowType.Dict
  })
  .option('indentType', {
    describe: 'Type of indentation',
    choices: [IndentType.Tab, IndentType.Space, IndentType.None],
    default: IndentType.Space
  })
  .option('indentSize', {
    describe: `Size of indentation (only matter if --indentType=${IndentType.Space}`,
    type: 'number',
    default: 2
  })
  .example('$0 < table.md', 'Print JSON representation of table inside table.md')
  .example('$0', 'Read a markdown table from stdin and parse it')
  .env('PARSE_MARKDOWN_TABLE')
  .help()

main({
  console,
  getStdIn,
  ...argv
})
  .then(status => process.exit(status))
  .catch(error => {
    console.error(String(error))
    return process.exit(Status.Failure)
  })
