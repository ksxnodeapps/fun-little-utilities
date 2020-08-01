import { ObjectTable, ListItem, createArrayTable } from 'table-parser-base'

class Items<Item extends ListItem<string, any>> implements ObjectTable<string, any> {
  constructor(
    public readonly items: readonly Item[],
  ) {}

  public async *[Symbol.asyncIterator]() {
    yield* this.items
  }
}

it('no holes', async () => {
  const items = new Items([
    { id: 1, name: 'John Doe', email: 'john-doe@gmail.com' },
    { id: 2, name: 'Peter Smith', email: 'petersmith22@outlook.com' },
    { id: 3, name: 'Julia Jones', email: 'jjones778@gmail.com' },
  ])

  const table = await createArrayTable(items)
  expect(table).toMatchSnapshot()
})

it('with holes', async () => {
  const items = new Items([
    { id: 1, name: 'John Doe', age: 32 },
    { id: 2, name: 'Peter Smith', sex: 'male', alive: true },
    { id: 3, name: 'Julia Jones', email: 'jjones778@gmail.com' },
  ])

  const table = await createArrayTable(items as any)
  expect(table).toMatchSnapshot()
})
