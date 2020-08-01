import { createMarkdownObjectTable } from 'parse-markdown-table'
import { getAsyncArray } from './lib/async-array'

const setup = async (text: string) => getAsyncArray(await createMarkdownObjectTable(text))

describe('empty string', () => {
  const text = ''

  it('rejects with a SyntaxError', async () => {
    await expect(setup(text)).rejects.toBeInstanceOf(SyntaxError)
  })

  it('matches snapshot', async () => {
    await expect(setup(text)).rejects.toMatchSnapshot()
  })
})

describe('string with naught but whitespaces', () => {
  const text = '  \n  \t '

  it('rejects with a SyntaxError', async () => {
    await expect(setup(text)).rejects.toBeInstanceOf(SyntaxError)
  })

  it('matches snapshot', async () => {
    await expect(setup(text)).rejects.toMatchSnapshot()
  })
})

describe('inconsistent right bound', () => {
  const text = `
    | id | name        | email                    |
    |----|-------------|--------------------------|
    |  1 | John Doe    | john-doe@gmail.com
    |  2 | Peter Smith | petersmith22@outlook.com
    |  3 | Julia Jones | jjones778@gmail.com
  `

  it('rejects with a SyntaxError', async () => {
    await expect(setup(text)).rejects.toBeInstanceOf(SyntaxError)
  })

  it('matches snapshot', async () => {
    await expect(setup(text)).rejects.toMatchSnapshot()
  })
})

describe('inconsistent left bound', () => {
  const text = `
    | id | name        | email                    |
    |----|-------------|--------------------------|
       1 | John Doe    | john-doe@gmail.com       |
       2 | Peter Smith | petersmith22@outlook.com |
    |  3 | Julia Jones | jjones778@gmail.com      |
  `

  it('rejects with a SyntaxError', async () => {
    await expect(setup(text)).rejects.toBeInstanceOf(SyntaxError)
  })

  it('matches snapshot', async () => {
    await expect(setup(text)).rejects.toMatchSnapshot()
  })
})
