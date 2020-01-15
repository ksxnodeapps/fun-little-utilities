# Parse Markdown Table

## Usage

### `ArrayTable`

```javascript
const { createMarkdownArrayTable } = await import('parse-markdown-table')

const markdown = `
  | id | name        | email                    |
  |----|-------------|--------------------------|
  |  1 | John Doe    | john-doe@gmail.com       |
  |  2 | Peter Smith | petersmith22@outlook.com |
  |  3 | Julia Jones | jjones778@gmail.com      |
`

// this function can take string, string[], Iterable<string>, and AsyncIterable<string>
const table = await createMarkdownArrayTable(markdown)

console.info('headers', table.headers)
for await (const row of table.rows) {
  console.info('row', row)
}
```

**Output:**

```javascript
headers [ 'id', 'name', 'email' ]
row [ '1', 'John Doe', 'john-doe@gmail.com' ]
row [ '2', 'Peter Smith', 'petersmith22@outlook.com' ]
row [ '3', 'Julia Jones', 'jjones778@gmail.com' ]
```

### `ObjectTable`

```javascript
const { createMarkdownObjectTable } = await import('parse-markdown-table')

const markdown = `
  | id | name        | email                    |
  |----|-------------|--------------------------|
  |  1 | John Doe    | john-doe@gmail.com       |
  |  2 | Peter Smith | petersmith22@outlook.com |
  |  3 | Julia Jones | jjones778@gmail.com      |
`

// this function can take string, string[], Iterable<string>, or AsyncIterable<string>
const table = createMarkdownObjectTable(markdown)

for await (const row of table) {
  console.info('row', row)
}
```

**Output:**

```javascript
row { id: '1', name: 'John Doe', email: 'john-doe@gmail.com' }
row { id: '2', name: 'Peter Smith', email: 'petersmith22@outlook.com' }
row { id: '3', name: 'Julia Jones', email: 'jjones778@gmail.com' }
```

## License

[MIT](https://git.io/fxKXN) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
