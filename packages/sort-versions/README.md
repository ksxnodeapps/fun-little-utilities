# Sort Versions

Sort semantic versions

## Usage

```javascript
const sort = require('sort-versions')

/*
Expect:
  Array [
    "v0.0.0",
    "0.1.2",
    "v1.0.0",
    "1.0.1",
    "2.0.1",
    "v3.0.2",
    "3.1.0",
  ]
*/
console.log(sort([
  '3.1.0',
  'v3.0.2',
  'invalid 0',
  '2.0.1',
  'v1.0.0',
  'invalid 1',
  '1.0.1',
  '0.1.2',
  'v0.0.0'
]))
```

## LICENSE

[MIT](https://git.io/fxKXN) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
