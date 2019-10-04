# String Template Format: Base

Create string template tag that transform values into strings

## Usage

```javascript
import tag from 'string-template-format-base'
const myTag = tag(value => `[${typeof value} ${value}]`)
console.log(myTag`${123}; ${'abc'}; ${{ abc: 123 }}; ${[0, 1, 2]}`)
```

_should print:_

```
[number 123]; [string abc]; [object [Object object]]; [array 0,1,2]
```

## License

[MIT](https://git.io/fxKXN) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
