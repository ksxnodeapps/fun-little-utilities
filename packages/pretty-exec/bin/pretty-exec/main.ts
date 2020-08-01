import { spawnSync } from 'child_process'
import process from 'process'
import { main } from '../../index'

const status = main({
  spawn: spawnSync,
  print: console.info,
  error: console.error,
  process,
})

if (status === null) {
  console.error('[ERROR] Exit status is null, something goes wrong')
  throw process.exit(-1)
}

throw process.exit(status)
