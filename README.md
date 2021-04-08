# Khải's Fun Little Utilities
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fksxnodeapps%2Ffun-little-utilities.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fksxnodeapps%2Ffun-little-utilities?ref=badge_shield)

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

## License

[MIT](https://git.io/fxKXN) © [Hoàng Văn Khải](https://ksxgithub.github.io)

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fksxnodeapps%2Ffun-little-utilities.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fksxnodeapps%2Ffun-little-utilities?ref=badge_large)
