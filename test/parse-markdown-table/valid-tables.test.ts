import { createMarkdownObjectTable, createMarkdownArrayTable } from 'parse-markdown-table'
import { getAsyncArray } from './lib/async-array'

describe('full bound', () => {
  async function setup () {
    const text = `
      | id | name        | email                    |
      |----|-------------|--------------------------|
      |  1 | John Doe    | john-doe@gmail.com       |
      |  2 | Peter Smith | petersmith22@outlook.com |
      |  3 | Julia Jones | jjones778@gmail.com      |
    `

    const table = await createMarkdownObjectTable(text)
    const list = await getAsyncArray(table)
    return { text, table, list }
  }

  it('object matches snapshot', async () => {
    const { table } = await setup()
    expect(table).toMatchSnapshot()
  })

  it('list matches snapshot', async () => {
    const { list } = await setup()
    expect(list).toMatchSnapshot()
  })
})

describe('left bound', () => {
  async function setup () {
    const text = `
      | id | name        | email
      |----|-------------|--------------------------
      |  1 | John Doe    | john-doe@gmail.com
      |  2 | Peter Smith | petersmith22@outlook.com
      |  3 | Julia Jones | jjones778@gmail.com
    `

    const table = await createMarkdownObjectTable(text)
    const list = await getAsyncArray(table)
    return { text, table, list }
  }

  it('object matches snapshot', async () => {
    const { table } = await setup()
    expect(table).toMatchSnapshot()
  })

  it('list matches snapshot', async () => {
    const { list } = await setup()
    expect(list).toMatchSnapshot()
  })
})

describe('right bound', () => {
  async function setup () {
    const text = `
       id | name        | email                    |
      ----|-------------|--------------------------|
        1 | John Doe    | john-doe@gmail.com       |
        2 | Peter Smith | petersmith22@outlook.com |
        3 | Julia Jones | jjones778@gmail.com      |
    `

    const table = await createMarkdownObjectTable(text)
    const list = await getAsyncArray(table)
    return { text, table, list }
  }

  it('object matches snapshot', async () => {
    const { table } = await setup()
    expect(table).toMatchSnapshot()
  })

  it('list matches snapshot', async () => {
    const { list } = await setup()
    expect(list).toMatchSnapshot()
  })
})

describe('no bound', () => {
  async function setup () {
    const text = `
       id | name        | email
      ----|-------------|--------------------------
        1 | John Doe    | john-doe@gmail.com
        2 | Peter Smith | petersmith22@outlook.com
        3 | Julia Jones | jjones778@gmail.com
    `

    const table = await createMarkdownObjectTable(text)
    const list = await getAsyncArray(table)
    return { text, table, list }
  }

  it('object matches snapshot', async () => {
    const { table } = await setup()
    expect(table).toMatchSnapshot()
  })

  it('list matches snapshot', async () => {
    const { list } = await setup()
    expect(list).toMatchSnapshot()
  })
})

describe('unknown columns', () => {
  async function setup () {
    const text = `
      | id | name        | email                    |
      |----|-------------|--------------------------|
      |  1 | John Doe    | john-doe@gmail.com       |  123 | male | true |
      |  2 | Peter Smith | petersmith22@outlook.com |
      |  3 | Julia Jones | jjones778@gmail.com      |  12  | female |
    `

    const table = await createMarkdownObjectTable(text)
    const list = await getAsyncArray(table)
    return { text, table, list }
  }

  it('object matches snapshot', async () => {
    const { table } = await setup()
    expect(table).toMatchSnapshot()
  })

  it('list matches snapshot', async () => {
    const { list } = await setup()
    expect(list).toMatchSnapshot()
  })
})

async function * getChunks (text: string, splitter: string) {
  const [first, ...rest] = text.split(splitter)
  yield first
  yield * rest.map(chunk => splitter + chunk)
}

describe('iterate by lines', () => {
  async function setup () {
    const text = `
      | id | name        | email                    |
      |----|-------------|--------------------------|
      |  1 | John Doe    | john-doe@gmail.com       |
      |  2 | Peter Smith | petersmith22@outlook.com |
      |  3 | Julia Jones | jjones778@gmail.com      |
    `

    const table = await createMarkdownObjectTable(getChunks(text, '\n'))
    const list = await getAsyncArray(table)
    return { text, table, list }
  }

  it('object matches snapshot', async () => {
    const { table } = await setup()
    expect(table).toMatchSnapshot()
  })

  it('list matches snapshot', async () => {
    const { list } = await setup()
    expect(list).toMatchSnapshot()
  })
})

describe('iterate by chunks', () => {
  async function setup () {
    const text = `
      | id | name        | email                    |
      |----|-------------|--------------------------|
      |  1 | John Doe    | john-doe@gmail.com       |
      |  2 | Peter Smith | petersmith22@outlook.com |
      |  3 | Julia Jones | jjones778@gmail.com      |
    `

    const table = await createMarkdownObjectTable(getChunks(text, '|'))
    const list = await getAsyncArray(table)
    return { text, table, list }
  }

  it('object matches snapshot', async () => {
    const { table } = await setup()
    expect(table).toMatchSnapshot()
  })

  it('list matches snapshot', async () => {
    const { list } = await setup()
    expect(list).toMatchSnapshot()
  })
})

describe('createMarkdownArrayTable', () => {
  async function setup () {
    const text = `
      | id | name        | email                    |
      |----|-------------|--------------------------|
      |  1 | John Doe    | john-doe@gmail.com       |
      |  2 | Peter Smith | petersmith22@outlook.com |
      |  3 | Julia Jones | jjones778@gmail.com      |
    `

    const table = await createMarkdownArrayTable(text)
    const headers = table.headers
    const rows = await getAsyncArray(table.rows)
    return { text, table, headers, rows }
  }

  it('headers matches snapshot', async () => {
    const { headers } = await setup()
    expect(headers).toMatchSnapshot()
  })

  it('headers matches snapshot', async () => {
    const { rows } = await setup()
    expect(rows).toMatchSnapshot()
  })
})
