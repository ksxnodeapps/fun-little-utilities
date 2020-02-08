# Simple Delay

Create a promise that resolves after a certain amount of time

## Usages

### Basic

```javascript
import delay from 'simple-delay'
delay(5000).then(() => console.log('5 seconds have passed'))
```

### Supply your own `setTimeout`

```javascript
import { callSetTimeout } from 'simple-delay'
const mySetTimeout = setTimeout
callSetTimeout(mySetTimeout, 5000).then(() => console.log('5 seconds have passed'))
```

## License

[MIT](https://git.io/fxKXN) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
