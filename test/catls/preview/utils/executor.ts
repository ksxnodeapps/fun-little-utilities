import process from 'process'
import { spawn } from 'child_process'
import chalk from 'chalk'
import event2promise from 'ts-await-event'
import { writeln, fromChildProcess } from 'split-shell-buffer'
import commandTitle from './command-title'
const script = require.resolve('../executable')

async function execute(args: string[], WDIR: string): Promise<void> {
  console.info(commandTitle('catls', args))

  const cp = spawn(
    'node',
    [script, ...args],
    {
      env: {
        ...process.env,

        // I can't change working directory before the script registers TypeScript loader,
        // so I pass it as an environment variable instead
        WDIR,
      },
    },
  )

  const closeEventPromise = event2promise<'close', number>(cp, 'close')
  const prefix = Buffer.from(chalk.dim('  | '))
  const splitter = fromChildProcess(cp as any).withPrefix(prefix) // quick fix
  await writeln(process.stdout, splitter)

  const status = await closeEventPromise
  console.info(`  status: ${chalk.redBright(String(status))}`)

  console.info()
}

export default (wdir: string) => (...args: string[]) => execute(args, wdir)
