# String Template Format: Compose

Compose string template tags

## Usage Examples

### Tag that logs

```javascript
import { compose } from 'string-template-format-compose'
import { inspect } from 'string-template-format-inspect'

// Create the tag
const log = compose(console.log, inspect)

// Use the tag
const num = 123
const str = 'abc'
const obj = { abc: 123, def: 456 }
const arr = [0, 1, 2]
log`number ${num}; string ${str}; object ${obj}; array ${arr}`
```

_should print:_

```
number 123; string 'abc'; object { abc: 123, def: 456 }; array [ 0, 1, 2 ]
```

### Tag that throws

```javascript
import { compose, construct } from 'string-template-format-compose'
import { inspect } from 'string-template-format-inspect'

// Create the tag
const raise = error => { throw error }
const err = compose(raise, construct(TypeError, inspect))

// Use the tag
const obj = { abc: 123, def: 456 }
const key = 'ghi'
err`Object ${obj} does not have property ${key}`
```

_should throw:_

```
TypeError: Object { abc: 123, def: 456 } does not have property 'ghi'
```

## License

[MIT](https://git.io/fxKXN) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
