import console from 'console'
import process from 'process'
import yargs from 'yargs'
import { Type, IndentType, Status, main } from './index'

const { argv } = yargs
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
  .env('TABLE_PARSER')
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
