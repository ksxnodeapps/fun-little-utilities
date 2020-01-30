# Better `path.join`

Like `path.join` but takes absolute path into account.

## What is wrong with built-in `path.join`?

It does not produce accurate path when non-first argument is an absolute path.

## Usage

### APIs

```typescript
declare function createJoinFunction (pathModule: {
  isAbsolute (): boolean
  join (left: string, right: string): string
}): (left: string, right: string) => string
```

### Example

```javascript
import path from 'path'
import createJoinFunction from 'better-path-join'
const join = createJoinFunction(path)
console.log('relative', join('abc/def', 'foo/bar'))
console.log('absolute', join('abc/def', '/foo/bar'))
```

**Output:**

```
relative abc/def/foo/bar
absolute /foo/bar
```

## License

[MIT](https://git.io/fxKXN) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
