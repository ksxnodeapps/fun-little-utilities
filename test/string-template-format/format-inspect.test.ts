import { inspect, InspectOptions } from 'util'
import { formatInspector, InspectFormatter, Inspector } from 'string-template-format'

const object: any = Object.create(null, {
  abc: { value: { a: { b: { c: 'abc' } } }, enumerable: true },
  hidden: { value: 'hidden', enumerable: false },
  circular: { get: () => object, enumerable: true }
})

describe('formatInspector', () => {
  it('works as template literal tag', () => {
    expect(formatInspector`
      number: ${123}
      string: ${'abc'}
      undefined: ${undefined}
      function: ${Function}
      class: ${class MyClass {}}
      object: ${object}
      array: ${[0, 1, 2, 3, 4]}
      symbol: ${Symbol('symbol')}
    `).toBe(`
      number: ${inspect(123)}
      string: ${inspect('abc')}
      undefined: ${inspect(undefined)}
      function: ${inspect(Function)}
      class: ${inspect(class MyClass {})}
      object: ${inspect(object)}
      array: ${inspect([0, 1, 2, 3, 4])}
      symbol: ${inspect(Symbol('symbol'))}
    `)
  })
})

describe('InspectFormatter', () => {
  it('without options', () => {
    expect(InspectFormatter()`
      number: ${123}
      string: ${'abc'}
      undefined: ${undefined}
      function: ${Function}
      class: ${class MyClass {}}
      object: ${object}
      array: ${[0, 1, 2, 3, 4]}
      symbol: ${Symbol('symbol')}
    `).toBe(`
      number: ${inspect(123)}
      string: ${inspect('abc')}
      undefined: ${inspect(undefined)}
      function: ${inspect(Function)}
      class: ${inspect(class MyClass {})}
      object: ${inspect(object)}
      array: ${inspect([0, 1, 2, 3, 4])}
      symbol: ${inspect(Symbol('symbol'))}
    `)
  })

  it('with options', () => {
    const options: InspectOptions = {
      breakLength: 12,
      depth: 12,
      getters: true,
      compact: false,
      showHidden: true,
      maxArrayLength: 0
    }

    const format = (x: any) => inspect(x, options)

    expect(InspectFormatter(options)`
      number: ${123}
      string: ${'abc'}
      undefined: ${undefined}
      function: ${() => Function}
      class: ${class MyClass {}}
      object: ${object}
      array: ${[0, 1, 2, 3, 4]}
      symbol: ${Symbol('symbol')}
    `).toBe(`
      number: ${format(123)}
      string: ${format('abc')}
      undefined: ${format(undefined)}
      function: ${format(() => Function)}
      class: ${format(class MyClass {})}
      object: ${format(object)}
      array: ${format([0, 1, 2, 3, 4])}
      symbol: ${format(Symbol('symbol'))}
    `)
  })
})

describe('Inspector', () => {
  it('literally returns util.inspect when options is not provided', () => {
    expect(Inspector()).toBe(inspect)
  })
})
