import { formatJson } from 'string-template-format'

it('converts values to json strings', () => {
  expect(formatJson`
    number: ${123}
    string: ${'abc'}
    object: ${{ abc: 123, def: 456 }}
    array: ${[0, 1, 2, 3]}
    boolean: ${true} ${false}
    null: ${null}
  `).toBe(`
    number: ${JSON.stringify(123)}
    string: ${JSON.stringify('abc')}
    object: ${JSON.stringify({ abc: 123, def: 456 })}
    array: ${JSON.stringify([0, 1, 2, 3])}
    boolean: ${JSON.stringify(true)} ${JSON.stringify(false)}
    null: ${JSON.stringify(null)}
  `)
})
