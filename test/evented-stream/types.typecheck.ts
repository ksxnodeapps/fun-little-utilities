import { spawn } from 'child_process'
import process from 'process'
import assert from 'static-type-assert'
import { EventedStream } from 'evented-stream'

const cp = spawn('')

assert<EventedStream<string | Buffer>>(process.stdin)
assert<EventedStream<Buffer>>(cp.stdout)
assert<EventedStream<Buffer>>(cp.stderr)
