import process from 'process'
import Splitter from 'split-shell-buffer'
import { mkDesc } from './.lib/conditional-test'
import { normalText, styledText } from './.lib/data'
import spawnExecutable from './.lib/spawn-executable'

it('correctly indents normal text', async () => {
  const indentedNormalText = [
    '  abc def ghi',
    '  jkl mno pqrs'
  ].join('\n')

  expect(
    await Splitter
      .fromString(normalText)
      .withIndent(2)
      .toString()
  ).toBe(
    await Splitter
      .fromString(indentedNormalText)
      .toString()
  )
})

it('indented styled text matches snapshot', async () => {
  expect(
    await Splitter
      .fromString(styledText)
      .withIndent(2)
      .toString()
  ).toMatchSnapshot()
})

it('indentation part of indented styled text only contain spaces and leading reset sequence', async () => {
  const indent = 4
  const regex = /^(\x1B\[(0|;)*m)? {4}/

  expect(
    (
      await Splitter
        .fromString(styledText)
        .withIndent(indent)
        .toString()
    )
      .split('\n')
      .every(text => regex.test(text))
  ).toBe(true)
})

describe('works with child processes', () => {
  {
    // Some Node.js versions do not support asyncIterator
    const describe = mkDesc(
      typeof Symbol.asyncIterator === 'symbol' &&
      Symbol.asyncIterator in process.stdin
    )

    describe('via fromIterableStream()', () => {
      it('on stdout', async () => {
        expect(
          await Splitter
            .fromIterableStream(spawnExecutable().stdout)
            .toString()
        ).toBe([
          'stdout 0',
          'stdout 1',
          'stdout 2',
          ''
        ].join('\n'))
      })

      it('on stderr', async () => {
        expect(
          await Splitter
            .fromIterableStream(spawnExecutable().stderr)
            .toString()
        ).toBe([
          'stderr 0',
          'stderr 1',
          'stderr 2',
          ''
        ].join('\n'))
      })
    })
  }

  describe('via fromEventedStream()', () => {
    it('on stdout', async () => {
      expect(
        await Splitter
          .fromEventedStream(spawnExecutable().stdout)
          .toString()
      ).toBe([
        'stdout 0',
        'stdout 1',
        'stdout 2',
        ''
      ].join('\n'))
    })

    it('on stderr', async () => {
      expect(
        await Splitter
          .fromEventedStream(spawnExecutable().stderr)
          .toString()
      ).toBe([
        'stderr 0',
        'stderr 1',
        'stderr 2',
        ''
      ].join('\n'))
    })
  })

  it('via fromChildProcess', async () => {
    expect(new Set(
      (
        await Splitter
          .fromChildProcess(spawnExecutable())
          .toString()
      )
        .split('\n')
    )).toEqual(new Set([
      'stdout 0',
      'stderr 0',
      'stdout 1',
      'stdout 2',
      'stderr 1',
      'stderr 2',
      ''
    ]))
  })
})
