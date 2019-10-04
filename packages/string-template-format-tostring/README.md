# String Template Format: toString

String template literal tag that converts any value that has `.toString()` method to strings

## Usage

```javascript
import str from 'string-template-format-tostring'
console.log(str`string: ${'abc'}; number: ${123}; function: ${Function};`)
```

_should print:_

```
string: abc; number: 123; function: function Function() { [native code] };
```

## License

[MIT](https://git.io/fxKXN) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
