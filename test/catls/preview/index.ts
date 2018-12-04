import process from 'process'
import { spawn } from 'child_process'
import { fromChildProcess, writeln } from 'split-shell-buffer'
import event2promise from 'ts-await-event'
const script = require.resolve('./executable')

async function execute (...args: string[]): Promise<void> {
  console.info(`\n$ catls ${args.join(' ')}`)

  const cp = spawn(
    'node',
    [script, ...args],
    {
      cwd: __dirname
    }
  )

  const closeEventPromise = event2promise<'close', number>(cp, 'close')
  const splitter = fromChildProcess(cp).withPrefix(Buffer.from('  | '))
  await writeln(process.stdout, splitter)

  const status = await closeEventPromise
  console.info(`  status: ${status}`)

  console.info()
}

async function main (): Promise<void> {
  await execute('--help')
  await execute('--noScript', 'data/folder/bar.txt', 'data/folder/baz.txt')
  await execute('data/folder/bar.txt', 'data/folder/baz.txt')
}

main().catch(error => {
  console.error(error)
  process.exit(-1)
})
