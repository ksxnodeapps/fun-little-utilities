import { spawn } from 'child_process'
const executable = require.resolve('../.data/executable')
export = () => spawn('node', [executable]) as any // quick fix
