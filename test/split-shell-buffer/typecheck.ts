// tslint:disable:no-unused-expression
// tslint:disable:no-floating-promises

import process from 'process'
import childProcess from 'child_process'
import assert from 'static-type-assert'
import * as all from 'split-shell-buffer'

assert.compare<all.Data, Buffer>('broaderLeft')
assert.compare<all.Data, ReadonlyArray<all.Code>>('broaderLeft')
assert.compare<all.Data, all.Code[]>('broaderLeft')
assert.compare<all.Sequence, Buffer>('broaderLeft')
assert.compare<all.Sequence, ReadonlyArray<all.Code>>('broaderLeft')
assert.compare<all.Sequence, all.Code[]>('broaderLeft')
assert.compare<all.Writable, typeof process.stdout>('broaderLeft')
assert.compare<all.Writable, typeof process.stderr>('broaderLeft')
assert.compare<all.Splitter, all.SplitterObject>('broaderLeft')

const splitter = all.create({ data: [] })
assert<all.SplitterObject>(splitter)
assert<all.Splitter>(splitter)
all.write(process.stdout, splitter)
all.write(process.stdin, splitter)

all.create({ data: Buffer.from('') })
all.create({ data: Buffer.from(''), prefix: Buffer.from(''), suffix: Buffer.from('') })
all.create({ data: [0, 1, 2, 3] })
all.create({ data: [0, 1], prefix: [2, 3], suffix: [4, 5] })

all.fromIterableStream(process.stdin)
all.fromIterableStream(childProcess.spawn('').stdout)
all.fromIterableStream(childProcess.spawn('').stderr)

all.fromEventedStream(process.stdin)
all.fromEventedStream(childProcess.spawn('').stdout)
all.fromEventedStream(childProcess.spawn('').stderr)
