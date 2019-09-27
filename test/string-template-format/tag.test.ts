import { tag } from 'string-template-format'

describe('throws an error when number difference between strings and values is not 1', () => {
  it('there are significantly more strings than values', () => {
    expect(() => tag(String)(['a', 'b', 'c', 'd', 'e'], 0, 1, 2)).toThrowErrorMatchingSnapshot()
  })

  it('there are less strings than values', () => {
    expect(() => tag(String)(['a', 'b', 'c'], 0, 1, 2, 3, 4)).toThrowErrorMatchingSnapshot()
  })
})

it('works as template literal tag', () => {
  expect(tag(String)`
    abc: ${123}
    def: ${456}
    ghi: ${789}
  `).toBe(`
    abc: 123
    def: 456
    ghi: 789
  `)
})
