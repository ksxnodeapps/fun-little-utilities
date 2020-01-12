import { err, tryExec } from '@tsfun/result'
import { MarkdownObjectTable } from 'parse-markdown-table'

const setup = (text: string) => tryExec(() => new MarkdownObjectTable(text))

describe('empty string', () => {
  const text = ''

  it('throws a SyntaxError', () => {
    expect(setup(text)).toEqual(err(expect.any(SyntaxError)))
  })

  it('matches snapshot', () => {
    expect(setup(text)).toMatchSnapshot()
  })
})

describe('string with naught but whitespaces', () => {
  const text = '  \n  \t '

  it('throws a SyntaxError', () => {
    expect(setup(text)).toEqual(err(expect.any(SyntaxError)))
  })

  it('matches snapshot', () => {
    expect(setup(text)).toMatchSnapshot()
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

  it('throws a SyntaxError', () => {
    expect(setup(text)).toEqual(err(expect.any(SyntaxError)))
  })

  it('matches snapshot', () => {
    expect(setup(text)).toMatchSnapshot()
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

  it('throws a SyntaxError', () => {
    expect(setup(text)).toEqual(err(expect.any(SyntaxError)))
  })

  it('matches snapshot', () => {
    expect(setup(text)).toMatchSnapshot()
  })
})
