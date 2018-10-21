const iter = require('iter-tools')
const xjest = require('extra-jest')
const { spawnSync } = require('@tools/preloaded-node')
const createWideText = require('wide-text')
const bin = require.resolve('wide-text-bin')

it('--help', xjest.snapSpawn.snap(spawnSync, [bin, '--help']))

describe('when call', () => {
  const inputs = [
    'abc',
    'a b c',
    'hello world',
    'foo bar baz',
    'abc de f'
  ]

  const zipObject = outputs => Array
    .from(iter.zipAll(inputs, outputs))
    .reduce((prev, [key, value]) => Object.assign(prev, { [key]: value }), {})

  const getExpected = options => zipObject(inputs.map(
    text => createWideText(text, options)
  ))

  const getReceived = (argv = []) => zipObject(inputs.map(
    text => String(spawnSync([bin, text, ...argv], { encoding: 'utf8' }).stdout).trim()
  ))

  it('without options', () => {
    const expected = getExpected()
    const received = getReceived()
    expect(received).toEqual(expected)
  })
})
