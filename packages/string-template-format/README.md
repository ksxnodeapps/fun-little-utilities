# String Template Format

String template tag that accepts any value and returns a string

## Usage Examples

### Embed objects into string as JSON

```typescript
import { formatJson } from 'string-template-format'
console.log(formatJson`number ${123}; string: ${'abc'}; object: ${{ abc: 123 }}; array: ${[0, 1, 2]}`)
```

_should print:_

```
number: 123; string: "abc"; object: {"abc":123}; array: [0,1,2]
```

### Format objects with `util.inspect`

```typescript
import { formatInspect } from 'string-template-format'
console.log(formatInspect`number ${123}; string: ${'abc'}; object: ${{ abc: 123 }}; array: ${[0, 1, 2]}`)
```

_should print:_

```
number: 123; string: 'abc'; object: { abc: 123 }; array: [ 0, 1, 2 ]
```

### Custom tags

```typescript
import { tag } from 'string-template-format'
const myTag = tag(value => `[${typeof value} ${value}]`)
console.log(myTag`${123}; ${'abc'}; ${{ abc: 123 }}; ${[0, 1, 2]}`)
```

_should print:_

```
[number 123]; [string abc]; [object [Object object]]; [array 0,1,2]
```

## License

[MIT](https://git.io/fxKXN) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
