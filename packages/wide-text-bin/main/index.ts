import yargs from 'yargs'
import createWideText from 'wide-text'

const { argv } = yargs
  .usage('$0 <text> [options]')
  .option('charSep', {
    alias: 'c',
    describe: 'Size of separator between characters in a word',
    type: 'number',
    default: 1
  })
  .option('wordSep', {
    alias: 'w',
    describe: 'Size of separator between words',
    type: 'number',
    default: 2
  })
  .help()

const {
  _: [text],
  charSep,
  wordSep
} = argv as {
  readonly charSep: number
  readonly wordSep: number
} & typeof argv

const result = createWideText(text, { charSep, wordSep })
console.info(result)
