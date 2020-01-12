import { MarkdownObjectTable } from 'parse-markdown-table'

describe('full bound', () => {
  function setup () {
    const text = `
      | id | name        | email                    |
      |----|-------------|--------------------------|
      |  1 | John Doe    | john-doe@gmail.com       |
      |  2 | Peter Smith | petersmith22@outlook.com |
      |  3 | Julia Jones | jjones778@gmail.com      |
    `

    const table = new MarkdownObjectTable(text)
    const list = Array.from(table)
    return { text, table, list }
  }

  it('object matches snapshot', () => {
    expect(setup().table).toMatchSnapshot()
  })

  it('list matches snapshot', () => {
    expect(setup().list).toMatchSnapshot()
  })
})

describe('left bound', () => {
  function setup () {
    const text = `
      | id | name        | email
      |----|-------------|--------------------------
      |  1 | John Doe    | john-doe@gmail.com
      |  2 | Peter Smith | petersmith22@outlook.com
      |  3 | Julia Jones | jjones778@gmail.com
    `

    const table = new MarkdownObjectTable(text)
    const list = Array.from(table)
    return { text, table, list }
  }

  it('object matches snapshot', () => {
    expect(setup().table).toMatchSnapshot()
  })

  it('list matches snapshot', () => {
    expect(setup().list).toMatchSnapshot()
  })
})

describe('right bound', () => {
  function setup () {
    const text = `
       id | name        | email                    |
      ----|-------------|--------------------------|
        1 | John Doe    | john-doe@gmail.com       |
        2 | Peter Smith | petersmith22@outlook.com |
        3 | Julia Jones | jjones778@gmail.com      |
    `

    const table = new MarkdownObjectTable(text)
    const list = Array.from(table)
    return { text, table, list }
  }

  it('object matches snapshot', () => {
    expect(setup().table).toMatchSnapshot()
  })

  it('list matches snapshot', () => {
    expect(setup().list).toMatchSnapshot()
  })
})

describe('no bound', () => {
  function setup () {
    const text = `
       id | name        | email
      ----|-------------|--------------------------
        1 | John Doe    | john-doe@gmail.com
        2 | Peter Smith | petersmith22@outlook.com
        3 | Julia Jones | jjones778@gmail.com
    `

    const table = new MarkdownObjectTable(text)
    const list = Array.from(table)
    return { text, table, list }
  }

  it('object matches snapshot', () => {
    expect(setup().table).toMatchSnapshot()
  })

  it('list matches snapshot', () => {
    expect(setup().list).toMatchSnapshot()
  })
})

describe('unknown columns', () => {
  function setup () {
    const text = `
      | id | name        | email                    |
      |----|-------------|--------------------------|
      |  1 | John Doe    | john-doe@gmail.com       |  123 | male | true |
      |  2 | Peter Smith | petersmith22@outlook.com |
      |  3 | Julia Jones | jjones778@gmail.com      |  12  | female |
    `

    const table = new MarkdownObjectTable(text)
    const list = Array.from(table)
    return { text, table, list }
  }

  it('object matches snapshot', () => {
    expect(setup().table).toMatchSnapshot()
  })

  it('list matches snapshot', () => {
    expect(setup().list).toMatchSnapshot()
  })
})
