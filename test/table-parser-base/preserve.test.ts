import { ArrayTable, ObjectTable, ListItem, createArrayTable, createObjectTable } from 'table-parser-base'
import { getAsyncArray } from './lib/async-array'

it('ArrayTable → ObjectTable → ArrayTable', async () => {
  class Cells implements ArrayTable<string, any> {
    constructor(
      public readonly headers: string[],
      public readonly rows: any[][],
    ) {}
  }

  const x = new Cells(
    ['id', 'name', 'email'],
    [
      [1, 'John Doe', 'john-doe@gmail.com'],
      [2, 'Peter Smith', 'petersmith22@outlook.com'],
      [3, 'Julia Jones', 'jjones778@gmail.com'],
    ],
  )

  const f = () => createObjectTable(x)
  const g = () => createArrayTable(f())
  const y = createObjectTable(await g())

  expect(await getAsyncArray(y)).toEqual(await getAsyncArray(f()))
})

it('ObjectTable → ArrayTable → ObjectTable', async () => {
  class Items<Item extends ListItem<string, any>> implements ObjectTable<string, any> {
    constructor(
      public readonly items: readonly Item[],
    ) {}

    public async *[Symbol.asyncIterator]() {
      yield* this.items
    }
  }

  const x0 = new Items([
    { id: 1, name: 'John Doe', email: 'john-doe@gmail.com' },
    { id: 2, name: 'Peter Smith', email: 'petersmith22@outlook.com' },
    { id: 3, name: 'Julia Jones', email: 'jjones778@gmail.com' },
  ])

  const x1 = await createArrayTable(x0)
  const x2 = createObjectTable(x1)
  const x3 = await createArrayTable(x2)

  expect(x3).toEqual(x1)
})
