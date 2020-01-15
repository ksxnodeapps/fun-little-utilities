import console from 'console'
import process from 'process'
import yargs from 'yargs'
import { Format, IndentType, Status, main } from './'

process.argv[0] = 'parse-markdown-table'

const { argv } = yargs
  .option('format', {
    describe: 'Structure of output',
    choices: [Format.List, Format.Dict, Format.JsonLines],
    default: Format.Dict
  })
  .option('indentType', {
    describe: 'Type of indentation',
    choices: [IndentType.Tab, IndentType.Space, IndentType.None],
    default: IndentType.Space
  })
  .option('indentSize', {
    describe: `Size of indentation\n(only apply if --indentType=${IndentType.Space})`,
    type: 'number',
    default: 2
  })
  .example('$0 < table.md', 'Print JSON representation of table inside table.md')
  .example('$0', 'Read a markdown table from stdin and parse it')
  .env('PARSE_MARKDOWN_TABLE')
  .wrap(process.stdout.columns * 4 / 7)
  .help()

main({
  console,
  stdin: process.stdin,
  ...argv
})
  .then(status => process.exit(status))
  .catch(error => {
    console.error(String(error))
    return process.exit(Status.Failure)
  })
