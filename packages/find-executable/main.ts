import process from 'process'
import yargs from 'yargs'
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

const status = main({
  cliOptions: argv,
  logger: console
})

process.exit(status)
