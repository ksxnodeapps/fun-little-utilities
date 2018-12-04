import process from 'process'
import { fromString, toString, SequenceFunc } from 'split-shell-buffer'
import { styledText } from './.lib/data'

async function main () {
  console.info('STYLED TEXT')
  console.info(styledText)
  console.info()

  console.info('STYLED TEXT → SPLITTED')
  console.info(await toString(fromString(styledText)))
  console.info()

  console.info('STYLED TEXT → SPLITTED AND INDENTED')
  console.info(await toString(fromString(styledText).withIndent(4)))
  console.info()

  console.info('STYLED TEXT → SPLITTED AND NUMBERED')
  console.info(await toString(fromString(styledText).withPrefix(getNumberingPrefix())))
  console.info()
}

function getNumberingPrefix (): SequenceFunc {
  let index = 0

  return () => {
    index += 1
    return Buffer.from(`${index}. `)
  }
}

enum ExitStatus {
  Success = 0,
  Failure = 1
}

main().then(
  () => process.exit(ExitStatus.Success),
  error => {
    console.error(error)
    process.exit(ExitStatus.Failure)
  }
)
