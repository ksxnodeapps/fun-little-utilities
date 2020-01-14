import { ArrayTable, createObjectTable } from 'table-parser-base'
import { getAsyncArray } from './lib/async-array'

class Cells extends ArrayTable<string, any> {
  constructor (
    public readonly headers: string[],
    public readonly rows: any[][]
  ) {
    super()
  }
}

it('no unknown columns', async () => {
  const cells = new Cells(
    ['id', 'name', 'email'],
    [
      [1, 'John Doe', 'john-doe@gmail.com'],
      [2, 'Peter Smith', 'petersmith22@outlook.com'],
      [3, 'Julia Jones', 'jjones778@gmail.com']
    ]
  )

  const list = createObjectTable(cells)

  expect(await getAsyncArray(list)).toMatchSnapshot()
})

it('with unknown columns', async () => {
  const cells = new Cells(
    ['id', 'name', 'email'],
    [
      [1, 'John Doe', 'john-doe@gmail.com'],
      [2, 'Peter Smith', 'petersmith22@outlook.com', 83, 'male', true],
      [3, 'Julia Jones', 'jjones778@gmail.com', 32]
    ]
  )

  const list = createObjectTable(cells)

  expect(await getAsyncArray(list)).toMatchSnapshot()
})
