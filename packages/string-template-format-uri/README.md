# String Template Format: URI

String template literal tag that converts string into valid URI/URL components

## Usage

```javascript
import { uri, uriComp } from 'string-template-format-uri'
const str = 'abc/def ghi'
console.log(uri`https://example.com/${str}`)
console.log(uriComp`https://example.com/${str}`)
```

_should print:_

```
https://example.com/abc/def%20ghi
https://example.com/abc%2Fdef%20ghi
```

## License

[MIT](https://git.io/fxKXN) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
