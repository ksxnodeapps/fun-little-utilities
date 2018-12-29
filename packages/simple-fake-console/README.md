# Simple Fake Console

Create fake consoles for testing purpose

## Usage

### Use it directly

```javascript
const { ConsoleInstance, ActionType, getString } = require('simple-fake-console')
const console = new ConsoleInstance()

console.log('hello', 'world')
console.info(0, 1, 2, 3)
console.error(new Error('foo'))
console.warn('Warning')

// Get all actions
//
// Result: Array<{
//   type: 'log' | 'info' | 'error' | 'warn',
//   data: any[]
// }>
console.getActions()

// Get string from selected types of actions
//
// Result: string
getString({
  console,
  types: [ActionType.Log, ActionType.Info]
})
```

### Use it in test via dependency injection

```typescript
// main.ts

import { Console } from 'simple-fake-console'

export function main (console: Console) {
  console.log('hello', 'world')
}
```

```typescript
// test.ts

import assert from 'assert'
import { ConsoleInstance, ActionType, getString } from 'simple-fake-console'
import { main } from './main'

const fakeConsole = new ConsoleInstance()
main(fakeConsole)

assert.deepStrictEqual(
  fakeConsole.getActions(),
  [{
    type: 'log',
    data: ['hello', 'world']
  }]
)

assert.strictEqual(
  getString({ console, types: [ActionType.Log] }),
  'hello world'
)
```

## License

[MIT](https://git.io/fxKXN) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
