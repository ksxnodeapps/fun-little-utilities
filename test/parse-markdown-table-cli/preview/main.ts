import console from 'console'
import process from 'process'
import { spawn } from 'child_process'

const emitter = require.resolve('./emitter.js')
const executable = require.resolve('./parser.js')

async function view (...args: string[]) {
  console.info('$ node emitter.js | parse-markdown-table', ...args)
  const emitterProcess = spawn('node', [emitter])

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

  console.info('done', executionResult, '\n')
}

async function main () {
  await view('--format', 'jsonl')
  await view()
}

main().catch(error => {
  console.error(error)
  return process.exit(-1)
})
