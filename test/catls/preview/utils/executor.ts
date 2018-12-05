import process from 'process'
import { spawn } from 'child_process'
import event2promise from 'ts-await-event'
import { writeln, fromChildProcess } from 'split-shell-buffer'
const script = require.resolve('../executable')

async function execute (args: string[], WDIR: string): Promise<void> {
  console.info(`\n$ catls ${args.join(' ')}`)

  const cp = spawn(
    'node',
    [script, ...args],
    {
      env: {
        ...process.env,
        WDIR
      }
    }
  )

  const closeEventPromise = event2promise<'close', number>(cp, 'close')
  const splitter = fromChildProcess(cp).withPrefix(Buffer.from('  | '))
  await writeln(process.stdout, splitter)

  const status = await closeEventPromise
  console.info(`  status: ${status}`)

  console.info()
}

export = (wdir: string) => (...args: string[]) => execute(args, wdir)
