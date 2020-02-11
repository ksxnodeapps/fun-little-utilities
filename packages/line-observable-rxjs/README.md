# Line Observable RxJs

Haskell-like lines for RxJs

## Usage Example

We have the following script:

```javascript
// script.js
const { getLinesFromStream } = require('line-observable-rxjs')
getLinesFromStream(process.stdin).subscribe({
  next: line => console.log('line>', line),
  complete: () => console.log('done.')
})
```

Run the script:

```sh
printf 'abc\ndef\nghi' | node script.js
```

Expected Output:

```
line> abc
line> def
line> ghi
done.
```

## License

[MIT](https://git.io/fxKXN) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
