import process from 'process'
import { spawnSync } from 'child_process'
const script = require.resolve('./executable')

function execute (...args: string[]): void {
  console.info(`$ catls ${args.join(' ')}\n`)

  const { status, signal } = spawnSync(
    'node',
    [script, ...args],
    {
      cwd: __dirname,
      stdio: 'inherit'
    }
  )

  if (status) {
    console.info({ status, signal })
    console.error(`Spawned process exits with code ${status}. Terminating.`)
    return process.exit(status)
  }
}

execute('data/foo/bar.txt')
console.info('\n\nDONE.\n')
