# String Template Format: JSON

String template literal tag that converts values to JSON text

## Usage

```javascript
import json from 'string-template-format-json'
console.log(json`number ${123}; string: ${'abc'}; object: ${{ abc: 123 }}; array: ${[0, 1, 2]}`)
```

_should print:_

```
number: 123; string: "abc"; object: {"abc":123}; array: [0,1,2]
```

## License

[MIT](https://git.io/fxKXN) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
