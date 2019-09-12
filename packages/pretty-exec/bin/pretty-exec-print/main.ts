import process from 'process'
import { main } from '../../index'

const status = main({
  spawn: () => ({ status: 0 }),
  print: console.info,
  error: console.error,
  process
})

throw process.exit(status)
