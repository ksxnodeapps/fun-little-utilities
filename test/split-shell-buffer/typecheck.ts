import process from 'process'
import assert from 'static-type-assert'
import Splitter from 'split-shell-buffer'

assert.compare<Splitter.Data, Buffer>('broaderLeft')
assert.compare<Splitter.Writable, typeof process.stdout>('broaderLeft')
assert.compare<Splitter.Writable, typeof process.stderr>('broaderLeft')

const splitter = new Splitter({ data: [] })
splitter.write(process.stdout)
splitter.writeln(process.stdout)
