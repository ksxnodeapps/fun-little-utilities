# W i d e T e x t

Create w i d e t e x t from normal text

## Usage

```javascript
const createWideText = require('wide-text')
createWideText('abc def ghi') // expect: 'a b c  d e f  g h i'
createWideText('abc def ghi', { charSep: 0, wordSep: 3 }) // expect: 'abc   def   ghi'
```

## License

[MIT](https://git.io/fxKXN) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
