# Create Command Arguments (CLI)

Convert environment variables to command-line arguments

## Usage

```sh
export MKCMDARGV_ARGS='[abc def]'
export MKCMDARGV_OPTIONS='{ a: 0, foo: 123 }'
export MKCMDARGV_SINGLE_FLAGS='sfx'
export MKCMDARGV_DOUBLE_FLAGS='quiet splash'
echo $(mkcmdargv)
```

## License

[MIT](https://git.io/fxKXN) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
