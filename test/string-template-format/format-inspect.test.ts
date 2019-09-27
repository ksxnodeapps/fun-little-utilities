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
    `).toMatchSnapshot()
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
    `).toMatchSnapshot()
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

    expect(InspectFormatter(options)`
      number: ${123}
      string: ${'abc'}
      undefined: ${undefined}
      function: ${() => Function}
      class: ${class MyClass {}}
      object: ${object}
      array: ${[0, 1, 2, 3, 4]}
      symbol: ${Symbol('symbol')}
    `).toMatchSnapshot()
  })
})

describe('Inspector', () => {
  it('literally returns util.inspect when options is not provided', () => {
    expect(Inspector()).toBe(inspect)
  })
})
