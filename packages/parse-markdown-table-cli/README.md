# Parse Markdown Table CLI

Convert a markdown table from text to JSON objects

## Usage

### `--help`

```
input-stream | parse-markdown-table [options]

Options:
  --version     Show version number                                                     [boolean]
  --format      Structure of output          [choices: "list", "dict", "jsonl"] [default: "dict"]
  --indentType  Type of indentation          [choices: "tab", "space", "none"] [default: "space"]
  --indentSize  Size of indentation
                (only apply if --indentType=space)                          [number] [default: 2]
  --help        Show help                                                               [boolean]

Examples:
  parse-markdown-table < table.md  Print JSON representation of table inside table.md
  parse-markdown-table             Read a markdown table from stdin and parse it
```

### Examples

#### `--format dict`

```sh
echo '
  | id | name        | email                    |
  |----|-------------|--------------------------|
  |  1 | John Doe    | john-doe@gmail.com       |
  |  2 | Peter Smith | petersmith22@outlook.com |
  |  3 | Julia Jones | jjones778@gmail.com      |
' | parse-markdown-table --format dict
```

**Output:**

```json
[
  {
    "id": "1",
    "name": "John Doe",
    "email": "john-doe@gmail.com"
  },
  {
    "id": "2",
    "name": "Peter Smith",
    "email": "petersmith22@outlook.com"
  },
  {
    "id": "3",
    "name": "Julia Jones",
    "email": "jjones778@gmail.com"
  }
]
```

#### `--format list`

```sh
echo '
  | id | name        | email                    |
  |----|-------------|--------------------------|
  |  1 | John Doe    | john-doe@gmail.com       |
  |  2 | Peter Smith | petersmith22@outlook.com |
  |  3 | Julia Jones | jjones778@gmail.com      |
' | parse-markdown-table --format list
```

**Output:**

```json
{
  "headers": [
    "id",
    "name",
    "email"
  ],
  "rows": [
    [
      "1",
      "John Doe",
      "john-doe@gmail.com"
    ],
    [
      "2",
      "Peter Smith",
      "petersmith22@outlook.com"
    ],
    [
      "3",
      "Julia Jones",
      "jjones778@gmail.com"
    ]
  ]
}
```

#### `--format jsonl`

```sh
echo '
  | id | name        | email                    |
  |----|-------------|--------------------------|
  |  1 | John Doe    | john-doe@gmail.com       |
  |  2 | Peter Smith | petersmith22@outlook.com |
  |  3 | Julia Jones | jjones778@gmail.com      |
' | parse-markdown-table --format jsonl
```

```json
{"id":"1","name":"John Doe","email":"john-doe@gmail.com"}
{"id":"2","name":"Peter Smith","email":"petersmith22@outlook.com"}
{"id":"3","name":"Julia Jones","email":"jjones778@gmail.com"}
```

## License

[MIT](https://git.io/fxKXN) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
