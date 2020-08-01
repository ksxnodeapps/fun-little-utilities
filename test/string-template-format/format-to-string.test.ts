import { formatToString } from 'string-template-format'

class MyObject {
  toString() {
    return '[MyObject]' as const
  }
}

it('converts values to strings', () => {
  expect(formatToString`
    number: ${123} ${NaN} ${Infinity}
    string: ${'abc'}
    object: ${new MyObject()}
    function: ${Function}
    class: ${MyObject}
    array: ${[0, 1, 2, 3]}
    boolean: ${true} ${false}
    null: ${null}
  `).toMatchSnapshot()
})
