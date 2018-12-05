import process from 'process'
import { spawn } from 'child_process'
import { fromChildProcess, writeln } from 'split-shell-buffer'
import event2promise from 'ts-await-event'
import createTree from './utils/fs-tree-factory'
const script = require.resolve('./executable')

async function main (): Promise<void> {
  async function execute (...args: string[]): Promise<void> {
    console.info(`\n$ catls ${args.join(' ')}`)

    const cp = spawn(
      'node',
      [script, ...args],
      {
        env: {
          ...process.env,
          WDIR: tree.targetPath
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

  const tree = await createTree()

  await execute()
  await execute('--help')

  await execute(
    '--noScript',
    'data/folder/foo.txt',
    'data/folder/bar.txt',
    'data/folder/baz.txt'
  )
  await execute(
    'data/folder/foo.txt',
    'data/folder/bar.txt',
    'data/folder/baz.txt'
  )

  await tree.destroy()
}

main().catch(error => {
  console.error(error)
  process.exit(-1)
})
