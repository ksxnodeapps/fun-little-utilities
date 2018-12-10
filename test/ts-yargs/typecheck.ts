import assert from 'static-type-assert'
import yargs from 'ts-yargs'

const { argv } = yargs
  .alias('foo', 'bar')
  .option('a', {
    describe: 'required string without coerce',
    required: true,
    type: 'string'
  })
  .option('b', {
    describe: 'required number without coerce',
    required: true,
    type: 'number'
  })
  .option('c', {
    describe: 'required boolean without coerce',
    required: true,
    type: 'boolean'
  })
  .option('d', {
    describe: 'optional string without coerce',
    type: 'string',
    default: 'foo'
  })
  .option('e', {
    describe: 'optional number without coerce',
    type: 'number',
    default: 123
  })
  .option('f', {
    describe: 'optional boolean without coerce',
    type: 'boolean',
    default: false
  })
  .option('g', {
    describe: 'required string with coerce',
    required: true,
    type: 'string',
    coerce: (value: string) => ({ value })
  })
  .option('h', {
    describe: 'choices',
    choices: ['foo', 'bar', 123, 456] as ['foo', 'bar', 123, 456],
    default: 123
  })

assert<{
  readonly a: string
  readonly b: number
  readonly c: boolean
  readonly d: string
  readonly e: number
  readonly f: boolean
  readonly g: { readonly value: string }
  readonly h: 'foo' | 'bar' | 123 | 456
}>(argv)
