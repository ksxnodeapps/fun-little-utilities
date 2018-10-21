# wide-text-bin

CLI program to create w i d e t e x t from normal text

## Installation

<pre><font color="#F9EE98">npm</font><font color="#A7A7A7"> install </font><font color="#5F5A60">--global</font><font color="#A7A7A7"> wide-text-bin</font></pre>

## Usage

```
wide-text <text> [options]

Options:
  --version      Show version number                                   [boolean]
  --charSep, -c  Number of spaces between characters in a word
                                                           [number] [default: 1]
  --wordSep, -w  Number of spaces between words            [number] [default: 2]
  --help         Show help                                             [boolean]
```

## Examples

```sh
# expect: 'a b c  d e f  g h i'
wide-text 'abc def ghi'

# expect: 'abc   def   ghi'
wide-text -c 0 -w 3 'abc def ghi'
```

## LICENSE

[MIT](https://git.io/fxKXN) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
