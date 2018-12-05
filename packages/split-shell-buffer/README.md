# Split Shell Buffer

Splitting shell strings while preserving [SGR escape sequences](https://en.wikipedia.org/wiki/ANSI_escape_code#SGR_(Select_Graphic_Rendition)_parameters)

## Motivation

When I was creating [`catls`](https://npmjs.com/package/catls), I needed to spawn a program and prints output (stdout and/or stderr) of said program to `process.stdout` with some prefix (e.g. indentation, bullets, numbers, etc.) whilst preserving some of UNIX control sequences (specifically, sequences that control colors).

## Preview

Run one of the commands below (in top-level folder of this repository):

<pre><code>pnpx execute runPreloadedNode <a href='https://git.io/fpX7e'>test/split-shell-buffer/preview.ts</a></code></pre>

<pre><code>pnpx execute runPreloadedNode <a href='https://git.io/fpX7s'>test/split-shell-buffer/preview.discrete.ts</a></code></pre>

## Usage Example

**NOTE:** Documentation is lacking (because I'm lazy), pull requests are welcomed.

**NOTE:** The following code snippets are executed in async context.

### `fromChildProcess`

The code below spawns a program and prints output (stdout + stderr) of said program with indent.

```javascript
const { stdout } = require('process')
const { spawn } = require('child_process')
const { fromChildProcess, writeln } = require('split-shell-buffer')

const cp = spawn('myprogram')
const splitter = fromChildProcess(cp).withIndent(4)

await writeln(stdout, splitter)
```

## License

[MIT](https://git.io/fxKXN) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
