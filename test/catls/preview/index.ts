import process from 'process'
import { spawnSync } from 'child_process'
const script = require.resolve('./executable')

function execute (...args: string[]): void {
  console.info(`\n$ catls ${args.join(' ')}\n`)

  const { status, signal } = spawnSync(
    'node',
    [script, ...args],
    {
      cwd: __dirname,
      stdio: 'inherit'
    }
  )

  console.info()

  if (status) {
    console.info({ status, signal })
    console.error(`Spawned process exits with code ${status}. Terminating.`)
    return process.exit(status)
  }
}

execute('--help')
execute('--noScript', 'data/foo/bar.txt', 'data/foo/baz.txt')
execute('data/foo/bar.txt', 'data/foo/baz.txt')
console.info('DONE.\n')
