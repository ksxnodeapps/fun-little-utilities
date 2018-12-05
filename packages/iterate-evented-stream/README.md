# Iterate Evented Stream

Create an `AsyncIterable` from an evented stream.

## Usage Examples

All code snippets below work in an async context.

### Custom `EventEmitter`

In order for an `EventEmitter` to be a valid `EventTarget`,

* It must listen to 3 required events:
  * `('data', string)`
  * `('error', Error)`
  * `('close')`

* It must provide 2 required methods for each event:
  * `addListener`
  * `removeListener`

* Iteration stops when the `EventEmitter` emits `'close'` or `'error'`
  * If it emits `'close'`, iteration is consider completed.
  * If it emits `'error'`, iteration throws the emitted error.

```javascript
const EventEmitter = require('events')
const iterate = require('iterate-evented-stream')
const emitter = new EventEmitter()

setTimeout(() => emitter.emit('data', '100 ms'), 100)
setTimeout(() => emitter.emit('data', '200 ms'), 200)
setTimeout(() => emitter.emit('data', '300 ms'), 300)
setTimeout(() => emitter.emit('data', '400 ms'), 400)
setTimeout(() => emitter.emit('close'), 500)

for await (const chunk of emitter) {
  console.log(chunk)
}
```

Expected Result:

```
100 ms
200 ms
300 ms
400 ms
```

### Child Process

**NOTE:** Replace `foo`, `bar` and `baz` below with commands that exist.

```javascript
const { spawn } = require('child_process')
const combine = require('combine-evented-stream')
const iterate = require('iterate-evented-stream')

const cps = [
  'foo',
  'bar',
  'baz'
].map(program => spawn(program))

const stream = combine(cps)

for await (const { stream, chunk } of iterate(stream)) {
  console.log({
    pid: stream.pid,
    data: chunk
  })
}

console.log('done.')
```

## License

[MIT](https://git.io/fxKXN) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
