import { List, CellSet } from 'table-parser-base'

it('no unknown columns', () => {
  const cells = new CellSet(
    ['id', 'name', 'email'],
    [
      [1, 'John Doe', 'john-doe@gmail.com'],
      [2, 'Peter Smith', 'petersmith22@outlook.com'],
      [3, 'Julia Jones', 'jjones778@gmail.com']
    ]
  )

  const list = new List(cells)

  expect(Array.from(list)).toMatchSnapshot()
})

it('with unknown columns', () => {
  const cells = new CellSet(
    ['id', 'name', 'email'],
    [
      [1, 'John Doe', 'john-doe@gmail.com'],
      [2, 'Peter Smith', 'petersmith22@outlook.com', 83, 'male', true],
      [3, 'Julia Jones', 'jjones778@gmail.com', 32]
    ]
  )

  const list = new List(cells)

  expect(Array.from(list)).toMatchSnapshot()
})
