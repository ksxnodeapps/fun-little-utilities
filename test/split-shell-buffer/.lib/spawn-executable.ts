import { spawn } from 'child_process'
const executable = require.resolve('../.data/executable')
export default () => spawn('node', [executable]) as any // quick fix
