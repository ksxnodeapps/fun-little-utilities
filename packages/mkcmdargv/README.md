# Create Command Arguments

Convert environment variables to command-line arguments

## Executable Usage

```sh
export MKCMDARGV_ARGS='[abc def]'
export MKCMDARGV_OPTIONS='{ a: 0, foo: 123 }'
export MKCMDARGV_SINGLE_FLAGS='sfx'
export MKCMDARGV_DOUBLE_FLAGS='quiet splash'
echo $(mkcmdargv)
```

## API Usage

### `iterateCommandArguments`

Creates an iterator of command arguments

```javascript
const { iterateCommandArguments } = require('mkcmdargv')

console.log(...iterateCommandArguments({
  args: ['abc', 'def'],
  options: { a: 0, foo: 123 },
  flags: ['s', 'f', 'x', 'quiet', 'splash']
}))
```

### `createCommandArguments`

Creates an array of command arguments

```javascript
const { createCommandArguments } = require('mkcmdargv')

createCommandArguments({
  args: ['abc', 'def'],
  options: { a: 0, foo: 123 },
  flags: ['s', 'f', 'x', 'quiet', 'splash']
}).forEach(arg => console.log(arg))
```

## License

[MIT](https://git.io/fxKXN) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
