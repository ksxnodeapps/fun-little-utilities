import { inspect } from 'util'
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
  `).toEqual(
    new Error(`
    number: ${inspect(123)}
    string: ${inspect('abc')}
    undefined: ${inspect(undefined)}
    function: ${inspect(() => undefined)}
    class: ${inspect(class MyClass {})}
    object: ${inspect({ abc: 123, def: 456 })}
    array: ${inspect([0, 1, 2, 3, 4])}
  `),
  )
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
  `).toEqual(
    new TypeError(`
    number: ${inspect(123)}
    string: ${inspect('abc')}
    undefined: ${inspect(undefined)}
    function: ${inspect(() => undefined)}
    class: ${inspect(class MyClass {})}
    object: ${inspect({ abc: 123, def: 456 })}
    array: ${inspect([0, 1, 2, 3, 4])}
  `),
  )
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
  `).toEqual(
    new Error(`
    number: ${inspect(123)}
    string: ${inspect('abc')}
    undefined: ${inspect(undefined)}
    function: ${inspect(() => undefined)}
    class: ${inspect(class MyClass {})}
    object: ${inspect({ abc: 123, def: 456 })}
    array: ${inspect([0, 1, 2, 3, 4])}
  `),
  )
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
  `).toEqual(
    new Error(`
    number: ${inspect(123)}
    string: ${inspect('abc')}
    undefined: ${inspect(undefined)}
    function: ${inspect(() => undefined)}
    class: ${inspect(class MyClass {})}
    object: ${inspect({ abc: 123, def: 456 })}
    array: ${inspect([0, 1, 2, 3, 4])}
  `),
  )
})
