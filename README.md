# Khải's Fun Little Utilities

## Development

### System Requirements

* Node.js ≥ 8.9.0
* Package Manager: [pnpm](https://pnpm.js.org/)
* Git

### Scripts

#### Build

```sh
pnpm run build
```

#### Clean

```sh
pnpm run clean
```

#### Test

##### Test Everything

```sh
pnpm test
```

##### Test Changed Files Only

```sh
pnpm test -- --onlyChanged
```

##### Update Jest Snapshot

```sh
pnpm test -- -u
```

#### Start Node.js REPL

This starts a Node.js REPL where you can import every module inside `packages/` folder.

```sh
pnpm run repl
```

## LICENSE

[MIT](https://git.io/fxKXN) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
