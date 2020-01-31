# Fake Path

Mockable fake path module

## Usages

```typescript
// Example in TypeScript

import { FakePath, symCwd, symRoot } from 'fake-path' // FakePath is an abstract class
class Path extends FakePath {
  public readonly [symCwd] = '/working/directory'
  public readonly [symRoot] = ['/']
  public readonly sep = '/'
}
const path = new Path() // you can access to some path methods from here
```

## License

[MIT](https://git.io/fxKXN) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
