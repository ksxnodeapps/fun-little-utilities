const iter = require('iter-tools')
const xjest = require('extra-jest')
const { spawnSync } = require('@tools/preloaded-node')
const createWideText = require('wide-text')
const bin = require('wide-text-bin').bin

it('--help', xjest.snapSpawn.snap(spawnSync, [bin, '--help']))

describe('when call', () => {
  const inputs = [
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

  it('with specified charSep', () => {
    const expected = getExpected({ charSep: 3 })
    const received = getReceived(['--charSep=3'])
    expect(received).toEqual(expected)
  })

  it('with specified wordSep', () => {
    const expected = getExpected({ wordSep: 6 })
    const received = getReceived(['--wordSep=6'])
    expect(received).toEqual(expected)
  })

  it('with specified charSep and wordSep', () => {
    const expected = getExpected({ charSep: 3, wordSep: 6 })
    const received = getReceived(['--charSep=3', '--wordSep=6'])
    expect(received).toEqual(expected)
  })

  it('with multiple inputs at once', xjest.snapSpawn.snap(spawnSync, [bin, ...inputs]))
})
