# Exec Once

Create a function that executes once

## Examples

This code should prints 10 lines of the same number

```javascript
const once = require('exec-once')
const randomOnce = once(Math.random())
for (let count = 10; count; --count) {
  console.log(randomOnce())
}
```

## License

[MIT](https://git.io/fxKXN) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
