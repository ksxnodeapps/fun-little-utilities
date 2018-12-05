import process from 'process'
import { COMMAND_NAME } from './constants'
process.argv0 = COMMAND_NAME
process.argv[0] = COMMAND_NAME
