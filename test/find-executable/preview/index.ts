import process from 'process'
import execute from './utils/execute'

async function main(): Promise<void> {
  await execute()
  await execute('--help')

  await execute(
    'abcdef',
    'ghijkl',
  )

  await execute(
    'not-found-0',
    'not-found-1',
    'git',
    'node',
  )

  await execute(
    'not-found-0',
    'not-found-1',
    'git',
    'node',
  )

  await execute(
    '--filter=word',
    'not-found-0',
    'not-found-1',
    'git',
    'node',
  )

  await execute(
    '--filter=path',
    'not-found-0',
    'not-found-1',
    'git',
    'node',
  )

  await execute(
    '--filter=both',
    'not-found-0',
    'not-found-1',
    'git',
    'node',
  )
}

main().catch(error => {
  console.error(error)
  process.exit(-1)
})
