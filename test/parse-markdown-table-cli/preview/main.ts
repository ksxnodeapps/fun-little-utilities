import console from 'console'
import process from 'process'
import { spawn } from 'child_process'

const emitter = require.resolve('./emitter.js')
const executable = require.resolve('./parser.js')

async function view (args: readonly string[], delay = 0) {
  console.info('$ node emitter.js | parse-markdown-table', ...args, '\n')

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
