import process from 'process'
import yargs from 'ts-yargs'
import { main, DisplaySelection } from 'find-executable-lib'
const { Word, Path, Both } = DisplaySelection

const { argv } = yargs
  .alias('h', 'help')
  .option('filter', {
    alias: 'f',
    describe: 'Display what?',
    choices: [Word, Path, Both],
    default: Path
  })
  .help()

const status = main(argv)
process.exit(status)
