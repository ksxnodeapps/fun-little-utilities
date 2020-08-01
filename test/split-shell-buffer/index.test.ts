import process from 'process'
import { mkDesc } from './.lib/conditional-test'
import { normalText, styledText } from './.lib/data'
import spawnExecutable from './.lib/spawn-executable'

import {
  fromString,
  toString,
  fromIterableStream,
  fromEventedStream,
  fromChildProcess,
} from 'split-shell-buffer'

it('correctly indents normal text', async () => {
  const indentedNormalText = [
    '  abc def ghi',
    '  jkl mno pqrs',
  ].join('\n')

  expect(
    await toString(
      fromString(normalText).withIndent(2),
    ),
  ).toBe(indentedNormalText)
})

it('indented styled text matches snapshot', async () => {
  expect(
    await toString(
      fromString(styledText).withIndent(2),
    ),
  ).toMatchSnapshot()
})

it('indentation part of indented styled text only contain spaces and leading reset sequence', async () => {
  const indent = 4
  const regex = /^(\x1B\[(0|;)*m)? {4}/

  expect(
    (
      await toString(
        fromString(styledText).withIndent(indent),
      )
    )
      .split('\n')
      .every(text => regex.test(text)),
  ).toBe(true)
})

it('numbered styled text matches snapshot', async () => {
  let index = 0

  const prefix = () => {
    index += 1
    return Buffer.from(`${index}. `)
  }

  expect(
    await toString(
      fromString(styledText).withPrefix(prefix),
    ),
  ).toMatchSnapshot()
})

describe('works with child processes', () => {
  {
    // Some Node.js versions do not support asyncIterator
    const describe = mkDesc(
      'asyncIterator' in Symbol &&
        Symbol.asyncIterator in process.stdin,
    )

    describe('via fromIterableStream()', () => {
      it('on stdout', async () => {
        expect(
          await toString(
            fromIterableStream(spawnExecutable().stdout),
          ),
        ).toBe([
          'stdout 0',
          'stdout 1',
          'stdout 2',
          '',
        ].join('\n'))
      })

      it('on stderr', async () => {
        expect(
          await toString(
            fromIterableStream(spawnExecutable().stderr),
          ),
        ).toBe([
          'stderr 0',
          'stderr 1',
          'stderr 2',
          '',
        ].join('\n'))
      })
    })
  }

  describe('via fromEventedStream()', () => {
    it('on stdout', async () => {
      expect(
        await toString(
          fromEventedStream(spawnExecutable().stdout),
        ),
      ).toBe([
        'stdout 0',
        'stdout 1',
        'stdout 2',
        '',
      ].join('\n'))
    })

    it('on stderr', async () => {
      expect(
        await toString(
          fromEventedStream(spawnExecutable().stderr),
        ),
      ).toBe([
        'stderr 0',
        'stderr 1',
        'stderr 2',
        '',
      ].join('\n'))
    })
  })

  it('via fromChildProcess', async () => {
    expect(
      new Set(
        (
          await toString(
            fromChildProcess(spawnExecutable()),
          )
        )
          .split('\n'),
      ),
    ).toEqual(
      new Set([
        'stdout 0',
        'stderr 0',
        'stdout 1',
        'stdout 2',
        'stderr 1',
        'stderr 2',
        '',
      ]),
    )
  })
})
