import {
  create,
  fromIterable,
  fromString,
  toString,
  write,
  writeln
} from 'split-shell-buffer'

import { normalText, styledText } from './.lib/data'

describe('fromString()', () => {
  it('constructs correct object', () => {
    expect(
      fromString(normalText)
    ).toEqual(
      create({
        data: Buffer.from(normalText)
      })
    )
  })
})

describe('toString()', () => {
  describe('with default options', () => {
    it('with normal text', async () => {
      expect(
        await toString(fromString(normalText))
      ).toEqual(
        await toString(
          fromString(normalText),
          { finalNewLine: false, encoding: 'utf8' }
        )
      )
    })

    it('with styled text', async () => {
      expect(
        await toString(fromString(styledText))
      ).toMatchSnapshot()
    })
  })

  describe('preserves normal text', () => {
    it('without options', async () => {
      expect(
        await toString(fromString(normalText))
      ).toEqual(normalText)
    })

    it('with finalNewLine = true', async () => {
      expect(
        await toString(
          fromString(normalText),
          { finalNewLine: true }
        )
      ).toEqual(normalText + '\n')
    })

    it('with encoding = "hex"', async () => {
      expect(
        await toString(
          fromString(normalText),
          { encoding: 'hex' }
        )
      ).toEqual(
        Buffer.from(normalText).toString('hex')
      )
    })
  })
})

describe('write()', () => {
  describe('with normal text', () => {
    const splitter = fromString(normalText)

    it('passes instances of Buffer to writable.write', async () => {
      await write({
        write (instance) {
          expect(instance).toBeInstanceOf(Buffer)
        }
      }, splitter)
    })

    it('passes buffers by line to writable.write', async () => {
      let count = 0

      await write({
        write () {
          count += 1
        }
      }, splitter)

      expect(count).toBe(normalText.split('\n').length)
    })

    it('passes buffers that resemble original text to writable.write', async () => {
      let text = ''

      await write({
        write (buffer) {
          text += buffer.toString()
        }
      }, splitter)

      expect(text).toBe(normalText)
    })
  })

  describe('with styled text', () => {
    const splitter = fromString(styledText)

    it('passes instances of Buffer to writable.write', async () => {
      await write({
        write (instance) {
          expect(instance).toBeInstanceOf(Buffer)
        }
      }, splitter)
    })

    it('passes buffers by line to writable.write', async () => {
      let count = 0

      await write({
        write () {
          count += 1
        }
      }, splitter)

      expect(count).toBe(styledText.split('\n').length)
    })

    it('passes buffers that resemble toString() to writable.write', async () => {
      let text = ''

      await write({
        write (buffer) {
          text += buffer.toString()
        }
      }, splitter)

      expect(text).toBe(await toString(splitter))
    })
  })
})

describe('writeln()', () => {
  describe('with normal text', () => {
    const splitter = fromString(normalText)

    it('passes instances of Buffer to writable.write', async () => {
      await writeln({
        write (instance) {
          expect(instance).toBeInstanceOf(Buffer)
        }
      }, splitter)
    })

    it('passes buffers by line to writable.write', async () => {
      let count = 0

      await writeln({
        write () {
          count += 1
        }
      }, splitter)

      expect(count).toBe(normalText.split('\n').length)
    })

    it('passes buffers that resemble original text with trailing eol to writable.write', async () => {
      let text = ''

      await writeln({
        write (buffer) {
          text += buffer.toString()
        }
      }, splitter)

      expect(text).toBe(normalText + '\n')
    })
  })

  describe('with styled text', () => {
    const splitter = fromString(styledText)

    it('passes instances of Buffer to writable.write', async () => {
      await writeln({
        write (instance) {
          expect(instance).toBeInstanceOf(Buffer)
        }
      }, splitter)
    })

    it('passes buffers by line to writable.write', async () => {
      let count = 0

      await writeln({
        write () {
          count += 1
        }
      }, splitter)

      expect(count).toBe(styledText.split('\n').length)
    })

    it('passes buffers that resemble toString() with trailing eol to writable.write', async () => {
      let text = ''

      await writeln({
        write (buffer) {
          text += buffer.toString()
        }
      }, splitter)

      expect(text).toBe(await toString(splitter) + '\n')
    })
  })
})

describe('withPrefix()', () => {
  it('creates a new instance', () => {
    const a = fromIterable([])
    const b = a.withPrefix([])
    expect(b).not.toBe(a)
  })

  it('creates an instance with modified prefix', () => {
    const prefix = Buffer.from('prefix')

    expect(
      fromIterable([])
        .withPrefix(prefix)
    ).toEqual(
      create({ data: [], prefix })
    )
  })
})

describe('withSuffix()', () => {
  it('creates a new instance', () => {
    const a = fromIterable([])
    const b = a.withSuffix([])
    expect(b).not.toBe(a)
  })

  it('creates an instance with modified suffix', () => {
    const suffix = Buffer.from('prefix')

    expect(
      fromIterable([])
        .withSuffix(suffix)
    ).toEqual(
      create({ data: [], suffix })
    )
  })
})

describe('withIndent()', () => {
  it('calls withPrefix()', () => {
    expect(
      fromIterable([])
        .withIndent(4)
    ).toEqual(
      fromIterable([])
        .withPrefix(Buffer.from(' '.repeat(4)))
    )
  })
})
