# Table Parser Base

Utilities for table parser packages

## Usage

### Convert an `ArrayTable` to an `ObjectTable`

```javascript
const { createObjectTable } = await import('table-parser-base')

const arrayTable = {
  headers: ['id', 'name', 'email'],
  rows: [
    [1, 'John Doe', 'john-doe@gmail.com'],
    [2, 'Peter Smith', 'petersmith22@outlook.com'],
    [3, 'Julia Jones', 'jjones778@gmail.com']
  ]
}

const objectTable = createObjectTable(arrayTable)
for await (const item of objectTable) {
  console.log(item)
}
```

**Output:**

```javascript
{ id: 1, name: 'John Doe', email: 'john-doe@gmail.com' }
{ id: 2, name: 'Peter Smith', email: 'petersmith22@outlook.com' }
{ id: 3, name: 'Julia Jones', email: 'jjones778@gmail.com' }
```

### Convert an `ObjectTable` to an `ArrayTable`

```javascript
const { createArrayTable } = await import('table-parser-base')

const objectTable = [
  { id: 1, name: 'John Doe', email: 'john-doe@gmail.com' },
  { id: 2, name: 'Peter Smith', email: 'petersmith22@outlook.com' },
  { id: 3, name: 'Julia Jones', email: 'jjones778@gmail.com' }
]

const arrayTable = await createArrayTable(objectTable)
console.log(arrayTable)
```

**Output:**

```javascript
{
  headers: [ 'id', 'name', 'email' ],
  rows: [
    [ 1, 'John Doe', 'john-doe@gmail.com' ],
    [ 2, 'Peter Smith', 'petersmith22@outlook.com' ],
    [ 3, 'Julia Jones', 'jjones778@gmail.com' ]
  ]
}
```

## License

[MIT](https://git.io/fxKXN) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
