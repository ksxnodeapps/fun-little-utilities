import yargs from 'yargs'
import createWideText from 'wide-text'

const { argv } = yargs
  .usage('$0 <text> [options]')
  .option('charSep', {
    alias: 'c',
    describe: 'Number of spaces between characters in a word',
    type: 'number',
    default: 1,
  })
  .option('wordSep', {
    alias: 'w',
    describe: 'Number of spaces between words',
    type: 'number',
    default: 2,
  })
  .help()

const {
  _: inputs,
  charSep,
  wordSep,
} = argv as {
  readonly charSep: number
  readonly wordSep: number
} & typeof argv

for (const text of inputs) {
  const output = createWideText(text, { charSep, wordSep })
  console.info(output)
}
