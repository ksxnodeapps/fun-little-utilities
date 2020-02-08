# Available NPM Name

Check if any package name is taken

## Performance

This program can test multiple package name in parallel as soon as each package name is supplied.

## Usages

### Provide package names via CLI arguments

The program will fetch package information in parallel.

```sh
available-npm-name foo bar baz
```

### Provide package names via Standard Input

The program will fetch each package name as soon as stdin yields a complete line. If stdin yields package names fast enough, the fetching will happen in parallel. If stdin yields package names not as fast as your Internet connection (such as when you enter it manually), then it will print each result as soon as each fetching is complete.

```sh
# read from file
available-npm-name < package-names.txt

# pipe via program
cat package-names.txt | available-npm-name

# or type it manually
available-npm-name
```

## License

[MIT](https://git.io/fxKXN) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
