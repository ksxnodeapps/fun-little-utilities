import process from 'process'
import { fromString, toString } from 'split-shell-buffer'
import { styledText } from './.lib/data'

async function main () {
  console.info('ORIGINAL')
  console.info(styledText)
  console.info()

  console.info('SPLITTED')
  console.info(await toString(fromString(styledText)))
  console.info()

  console.info('SPLITTED AND INDENTED')
  console.info(await toString(fromString(styledText).withIndent(4)))
  console.info()
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
