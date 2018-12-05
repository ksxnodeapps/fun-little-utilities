# Combine Evented Stream

Combine multiple evented streams into one

## Usage Examples

### Log output of multiple child processes

```javascript
const { spawn } = require('child_process')
const combine = require('combine-evented-stream')

const cps = [
  'foo',
  'bar',
  'baz'
].map(program => spawn(program))

const stream = combine(cps)

stream.addListener('data', ({ stream, chunk }) => {
  console.log({
    pid: stream.pid,
    data: chunk
  })
})

stream.addListener('close', () => {
  console.log('done.')
  return process.exit(0)
})
```

**Utilize [`iterate-evented-stream`](https://npmjs.com/package/iterate-evented-stream):**

Assuming the context of execution below is async.

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
