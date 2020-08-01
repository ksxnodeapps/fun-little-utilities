import process from 'process'
import { spawn, spawnSync } from 'child_process'
import { toString, SequenceFunc, fromChildProcess, writeln } from 'split-shell-buffer'
const executable = require.resolve('./.data/executable.discrete')

function execute() {
  return spawn('node', [executable]) as any // quick fix
}

async function main() {
  console.info('SPAWNED')
  spawnSync('node', [executable], { stdio: 'inherit' })
  console.info()

  console.info('SPAWNED → SPLITTED AND INDENTED → WRITELN')
  await writeln(process.stdout, fromChildProcess(execute()).withIndent(4))
  console.info()

  console.info('SPAWNED → SPLITTED AND NUMBERED → WRITELN')
  await writeln(process.stdout, fromChildProcess(execute()).withPrefix(getNumberingPrefix()))
  console.info()

  console.info('SPAWNED → SPLITTED AND INDENTED → TO STRING')
  console.info(await toString(fromChildProcess(execute()).withIndent(4)))
  console.info()

  console.info('SPAWNED → SPLITTED AND NUMBERED → TO STRING')
  console.info(await toString(fromChildProcess(execute()).withPrefix(getNumberingPrefix())))
  console.info()
}

function getNumberingPrefix(): SequenceFunc {
  let index = 0

  return () => {
    index += 1
    return Buffer.from(`${index}. `)
  }
}

enum ExitStatus {
  Success = 0,
  Failure = 1,
}

main().then(
  () => process.exit(ExitStatus.Success),
  error => {
    console.error(error)
    process.exit(ExitStatus.Failure)
  },
)
