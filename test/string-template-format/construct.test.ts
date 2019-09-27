import { construct, formatInspector } from 'string-template-format'

it('Error', () => {
  expect(construct(Error, formatInspector)`
    number: ${123}
    string: ${'abc'}
    undefined: ${undefined}
    function: ${() => undefined}
    class: ${class MyClass {}}
    object: ${{ abc: 123, def: 456 }}
    array: ${[0, 1, 2, 3, 4]}
  `).toMatchSnapshot()
})

it('TypeError', () => {
  expect(construct(TypeError, formatInspector)`
    number: ${123}
    string: ${'abc'}
    undefined: ${undefined}
    function: ${() => undefined}
    class: ${class MyClass {}}
    object: ${{ abc: 123, def: 456 }}
    array: ${[0, 1, 2, 3, 4]}
  `).toMatchSnapshot()
})

it('RangeError', () => {
  expect(construct(RangeError, formatInspector)`
    number: ${123}
    string: ${'abc'}
    undefined: ${undefined}
    function: ${() => undefined}
    class: ${class MyClass {}}
    object: ${{ abc: 123, def: 456 }}
    array: ${[0, 1, 2, 3, 4]}
  `).toMatchSnapshot()
})

it('SyntaxError', () => {
  expect(construct(SyntaxError, formatInspector)`
    number: ${123}
    string: ${'abc'}
    undefined: ${undefined}
    function: ${() => undefined}
    class: ${class MyClass {}}
    object: ${{ abc: 123, def: 456 }}
    array: ${[0, 1, 2, 3, 4]}
  `).toMatchSnapshot()
})
