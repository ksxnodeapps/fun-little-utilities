# String Template Format: Inspect

String template literal tag that uses Node's `util.inspect`

## Usage

```javascript
import dbg from 'string-template-format-inspect'
console.log(dbg`number ${123}; string: ${'abc'}; object: ${{ abc: 123 }}; array: ${[0, 1, 2]}`)
```

_should print:_

```
number: 123; string: 'abc'; object: { abc: 123 }; array: [ 0, 1, 2 ]
```

## License

[MIT](https://git.io/fxKXN) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
