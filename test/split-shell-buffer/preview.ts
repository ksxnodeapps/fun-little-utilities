import process from 'process'
import { spawn } from 'child_process'
import { fromString, toString, SequenceFunc, fromChildProcess, writeln } from 'split-shell-buffer'
import { styledText } from './.lib/data'
const executable = require.resolve('./.data/executable')

function execute () {
  return spawn('node', [executable])
}

async function main () {
  console.info('STYLED TEXT')
  console.info(styledText)
  console.info()

  console.info('STYLED TEXT → SPLITTED → TO STRING')
  console.info(await toString(fromString(styledText)))
  console.info()

  console.info('STYLED TEXT → SPLITTED AND INDENTED → TO STRING')
  console.info(await toString(fromString(styledText).withIndent(4)))
  console.info()

  console.info('STYLED TEXT → SPLITTED AND NUMBERED → TO STRING')
  console.info(await toString(fromString(styledText).withPrefix(getNumberingPrefix())))
  console.info()

  console.info('STYLED TEXT → SPLITTED → WRITELN')
  await writeln(process.stdout, fromString(styledText))
  console.info()

  console.info('STYLED TEXT → SPLITTED AND INDENTED → WRITELN')
  await writeln(process.stdout, fromString(styledText).withIndent(4))
  console.info()

  console.info('STYLED TEXT → SPLITTED AND NUMBERED → WRITELN')
  await writeln(process.stdout, fromString(styledText).withPrefix(getNumberingPrefix()))
  console.info()

  console.info('SPAWNED')
  require(executable)
  console.info()

  console.info('SPAWNED → SPLITTED AND INDENTED → TO STRING')
  console.info(await toString(fromChildProcess(execute()).withIndent(4)))
  console.info()

  console.info('SPAWNED → SPLITTED AND NUMBERED → TO STRING')
  console.info(await toString(fromChildProcess(execute()).withPrefix(getNumberingPrefix())))
  console.info()

  console.info('SPAWNED → SPLITTED AND INDENTED → WRITELN')
  await writeln(process.stdout, fromChildProcess(execute()).withIndent(4))
  console.info()

  console.info('SPAWNED → SPLITTED AND NUMBERED → WRITELN')
  await writeln(process.stdout, fromChildProcess(execute()).withPrefix(getNumberingPrefix()))
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
