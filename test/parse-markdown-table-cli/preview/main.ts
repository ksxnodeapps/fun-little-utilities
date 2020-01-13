import console from 'console'
import process from 'process'
import { spawn } from 'child_process'
import chalk from 'chalk'

const emitter = require.resolve('./emitter.js')
const executable = require.resolve('./parser.js')

function printCmd (...args: string[]) {
  console.info(...args.map(x => chalk.dim(x)))
}

async function view (args: readonly string[], delay = 0) {
  printCmd('$ export SLEEP=' + delay)
  printCmd('$ node emitter.js | parse-markdown-table', ...args)

  const emitterProcess = spawn('node', [emitter], {
    env: {
      SLEEP: String(delay)
    }
  })

  const mainProcess = spawn(executable, args, {
    stdio: [emitterProcess.stdout, 'inherit', 'inherit']
  })

  const executionResult: {
    readonly status: number
    readonly signal: NodeJS.Signals
  } = await new Promise(
    resolve => mainProcess.on(
      'close',
      (status, signal) => resolve({ status, signal })
    )
  )

  console.info('\n→', executionResult.status, executionResult.signal || '', '\n\n')
}

async function main () {
  await view([], 3)
  await view(['--format', 'list'])
  await view(['--format', 'jsonl'], 512)
}

main().catch(error => {
  console.error(error)
  return process.exit(-1)
})
