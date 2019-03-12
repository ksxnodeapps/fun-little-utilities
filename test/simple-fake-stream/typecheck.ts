import process from 'process'
import { spawn } from 'child_process'
import assert from 'static-type-assert'
import * as sfs from 'simple-fake-stream'

assert<sfs.Stream<string | Buffer>>(process.stdin)
assert<sfs.Stream<string | Buffer>>(process.stdout)
assert<sfs.Stream<string | Buffer>>(process.stderr)

const cp = spawn('_')
assert<sfs.WritableStream<Buffer>>(cp.stdin as any) // quick fix
assert<sfs.WritableStream<string>>(cp.stdin as any) // quick fix
assert<sfs.ReadableStream<string | Buffer>>(cp.stdout as any) // quick fix
assert<sfs.ReadableStream<string | Buffer>>(cp.stderr as any) // quick fix

type Chunk = 'Chunk'
type Err = 'Err'
const stream = new sfs.StreamInstance<Chunk, Err>()
assert<sfs.Stream<Chunk, Err>>(stream)
assert<sfs.ReadableStream<Chunk, Err>>(stream)
assert<sfs.WritableStream<Chunk>>(stream)
assert<sfs.EventedReadableStream<Chunk, Err>>(stream)
assert<sfs.IterableReadableStream<Chunk>>(stream)
