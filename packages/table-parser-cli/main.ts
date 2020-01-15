import console from 'console'
import process from 'process'
import yargs from 'yargs'
import { Type, IndentType, Status, main } from './index'

const { argv } = yargs
  .usage('table-parser-cli --type <type> [options]')
  .option('type', {
    alias: 't',
    describe: 'Convert from what to what',
    choices: [Type.ArrayToObject, Type.ObjectToArray],
    required: true
  })
  .option('indentType', {
    alias: 'i',
    describe: 'Indent character of JSON output',
    choices: [IndentType.Space, IndentType.Tab, IndentType.None],
    default: IndentType.Space
  })
  .option('indentSize', {
    alias: 's',
    describe: 'Indent size of JSON output (only apply when --indentType=space)',
    type: 'number',
    default: 2
  })
  .example(
    'table-parser-cli -t obj2arr < object-table.json',
    'Parse object-table.json as an ObjectTable, convert it to ArrayTable, and print result to stdout'
  )
  .example(
    'table-parser-cli -t arr2obj < array-table.json',
    'Parse object-table.json as an ArrayTable, convert it to ObjectTable, and print result to stdout'
  )
  .example(
    'table-parser-cli -t obj2arr < object-table.json > array-table.json',
    'Parse object-table.json as an ObjectTable, convert it to ArrayTable, and save result to array-table.json'
  )
  .example(
    'table-parser-cli -t arr2obj < array-table.json > object-table.json',
    'Parse object-table.json as an ArrayTable, convert it to ObjectTable, and save result to object-table.json'
  )
  .env('TABLE_PARSER')
  .wrap(process.stdout.columns)
  .help()

main({
  console,
  process,
  ...argv
})
  .then(status => process.exit(status))
  .catch(error => {
    console.error(String(error))
    return process.exit(Status.Failure)
  })
