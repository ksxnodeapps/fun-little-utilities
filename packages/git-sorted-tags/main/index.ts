import { spawnSync } from 'child_process'
import process from 'process'
import yargs from 'yargs'
import sort from 'sort-versions'

const { argv } = yargs
  .usage('$0 [options]')
  .option('format', {
    alias: 'f',
    describe: 'Format to display',
    choices: ['lines', 'array', 'json'],
    default: 'lines',
  })
  .option('jsonIndent', {
    alias: 'i',
    describe: 'Indentation of JSON format',
    type: 'number',
    default: 2,
  })
  .help()

const {
  format,
  jsonIndent,
} = argv as {
  format: 'lines' | 'array' | 'json'
  jsonIndent: number
} & typeof argv

namespace formatFunc {
  export type Param = ReadonlyArray<string>
  export const lines = (array: Param) => array.length ? array.join('\n') : '(empty)'
  export const array = (array: Param) => array
  export const json = (array: Param) => JSON.stringify(array, undefined, jsonIndent)
}

const { status, stdout } = spawnSync('git', ['tag'], { encoding: 'utf8' })
if (status) process.exit(status)
const versions = stdout.split(/\r|\n/).filter(Boolean)
const sorted = sort(versions)
const formatted = formatFunc[format](sorted)
console.info(formatted)
