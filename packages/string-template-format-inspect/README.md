# String Template Format: Inspect

String template literal tag that uses Node's `util.inspect`

## Usage Examples

### Without Options

```javascript
import { dbg } from 'string-template-format-inspect'
console.log(dbg`number ${123}; string: ${'abc'}; object: ${{ abc: 123 }}; array: ${[0, 1, 2]}`)
```

_should print:_

```
number: 123; string: 'abc'; object: { abc: 123 }; array: [ 0, 1, 2 ]
```

### With Options

```javascript
import { InspectFormatter } from 'string-template-format-inspect'
const dbg = InspectFormatter({ getters: true, maxArrayLength: 0 })
const myObject = { get abc () { return 123 }, def: [0, 1, 2] }
console.log(dbg`my object is ${myObject}`)
```

_should print:_

```
my object is { abc: [Getter: 123], def: [ ... 3 more items ] }
```

## License

[MIT](https://git.io/fxKXN) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
