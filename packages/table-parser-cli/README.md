# Table Parser CLI

## Usage

### `--help`

```
table-parser-cli --type <type> [options]

Options:
  --version         Show version number                                                                                                                          [boolean]
  --type, -t        Convert from what to what                                                                                   [required] [choices: "arr2obj", "obj2arr"]
  --indentType, -i  Indent character of JSON output                                                                   [choices: "space", "tab", "none"] [default: "space"]
  --indentSize, -s  Indent size of JSON output (only apply when --indentType=space)                                                                  [number] [default: 2]
  --help            Show help                                                                                                                                    [boolean]

Examples:
  table-parser-cli -t obj2arr < object-table.json                     Parse object-table.json as an ObjectTable, convert it to ArrayTable, and print result to stdout
  table-parser-cli -t arr2obj < array-table.json                      Parse object-table.json as an ArrayTable, convert it to ObjectTable, and print result to stdout
  table-parser-cli -t obj2arr < object-table.json > array-table.json  Parse object-table.json as an ObjectTable, convert it to ArrayTable, and save result to
                                                                      array-table.json
  table-parser-cli -t arr2obj < array-table.json > object-table.json  Parse object-table.json as an ArrayTable, convert it to ObjectTable, and save result to
                                                                      object-table.json
```

### Examples

#### Convert an `ArrayTable` to an `ObjectTable`

```sh
echo '{
  "headers": ["id", "name", "email"],
  "rows": [
    ["1", "John Doe", "john-doe@gmail.com"],
    ["2", "Peter Smith", "petersmith22@outlook.com"],
    ["3", "Julia Jones", "jjones778@gmail.com"]
  ]
}' | table-parser-cli -t arr2obj
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

#### Convert an `ObjectTable` to an `ArrayTable`

```sh
echo '[
  { "id": "1", "name": "John Doe", "email": "john-doe@gmail.com" },
  { "id": "2", "name": "Peter Smith", "email": "petersmith22@outlook.com" },
  { "id": "3", "name": "Julia Jones", "email": "jjones778@gmail.com" }
]' | table-parser-cli -t obj2arr
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

## License

[MIT](https://git.io/fxKXN) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
