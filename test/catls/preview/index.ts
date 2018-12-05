import process from 'process'
import executor from './utils/executor'
import createTree from './utils/fs-tree-factory'

async function main (): Promise<void> {
  const tree = await createTree()
  const execute = executor(tree.targetPath)

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
