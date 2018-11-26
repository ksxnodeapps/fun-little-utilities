import Splitter from 'split-shell-buffer'
import { normalText, styledText } from './.lib/data'

describe('constructor', () => {
  it('constructs correct object', () => {
    expect(
      Splitter.fromString(normalText)
    ).toEqual(
      new Splitter({
        data: Buffer.from(normalText)
      })
    )
  })
})

describe('toString()', () => {
  describe('with default options', () => {
    it('with normal text', async () => {
      expect(
        await Splitter
          .fromString(normalText)
          .toString()
      ).toEqual(
        await Splitter
          .fromString(normalText)
          .toString({ finalNewLine: false, encoding: 'utf8' })
      )
    })

    it('with styled text', async () => {
      expect(
        await Splitter
          .fromString(styledText)
          .toString()
      ).toMatchSnapshot()
    })
  })

  describe('preserves normal text', () => {
    it('without options', async () => {
      expect(
        await Splitter
          .fromString(normalText)
          .toString()
      ).toEqual(normalText)
    })

    it('with finalNewLine = true', async () => {
      expect(
        await Splitter
          .fromString(normalText)
          .toString({ finalNewLine: true })
      ).toEqual(normalText + '\n')
    })

    it('with encoding = "hex"', async () => {
      expect(
        await Splitter
          .fromString(normalText)
          .toString({ encoding: 'hex' })
      ).toEqual(
        Buffer.from(normalText).toString('hex')
      )
    })
  })
})

describe('write()', () => {
  describe('with normal text', () => {
    const splitter = Splitter.fromString(normalText)

    it('passes instances of Buffer to writable.write', async () => {
      await splitter.write({
        write (instance) {
          expect(instance).toBeInstanceOf(Buffer)
        }
      })
    })

    it('passes buffers by line to writable.write', async () => {
      let count = 0

      await splitter.write({
        write () {
          count += 1
        }
      })

      expect(count).toBe(normalText.split('\n').length)
    })

    it('passes buffers that resemble original text to writable.write', async () => {
      let text = ''

      await splitter.write({
        write (buffer) {
          text += buffer.toString()
        }
      })

      expect(text).toBe(normalText)
    })
  })

  describe('with styled text', () => {
    const splitter = Splitter.fromString(styledText)

    it('passes instances of Buffer to writable.write', async () => {
      await splitter.write({
        write (instance) {
          expect(instance).toBeInstanceOf(Buffer)
        }
      })
    })

    it('passes buffers by line to writable.write', async () => {
      let count = 0

      await splitter.write({
        write () {
          count += 1
        }
      })

      expect(count).toBe(styledText.split('\n').length)
    })

    it('passes buffers that resemble toString() to writable.write', async () => {
      let text = ''

      await splitter.write({
        write (buffer) {
          text += buffer.toString()
        }
      })

      expect(text).toBe(await splitter.toString())
    })
  })
})

describe('writeln()', () => {
  describe('with normal text', () => {
    const splitter = Splitter.fromString(normalText)

    it('passes instances of Buffer to writable.write', async () => {
      await splitter.writeln({
        write (instance) {
          expect(instance).toBeInstanceOf(Buffer)
        }
      })
    })

    it('passes buffers by line to writable.write', async () => {
      let count = 0

      await splitter.writeln({
        write () {
          count += 1
        }
      })

      expect(count).toBe(normalText.split('\n').length)
    })

    it('passes buffers that resemble original text with trailing eol to writable.write', async () => {
      let text = ''

      await splitter.writeln({
        write (buffer) {
          text += buffer.toString()
        }
      })

      expect(text).toBe(normalText + '\n')
    })
  })

  describe('with styled text', () => {
    const splitter = Splitter.fromString(styledText)

    it('passes instances of Buffer to writable.write', async () => {
      await splitter.writeln({
        write (instance) {
          expect(instance).toBeInstanceOf(Buffer)
        }
      })
    })

    it('passes buffers by line to writable.write', async () => {
      let count = 0

      await splitter.writeln({
        write () {
          count += 1
        }
      })

      expect(count).toBe(styledText.split('\n').length)
    })

    it('passes buffers that resemble toString() with trailing eol to writable.write', async () => {
      let text = ''

      await splitter.writeln({
        write (buffer) {
          text += buffer.toString()
        }
      })

      expect(text).toBe(await splitter.toString() + '\n')
    })
  })
})

describe('withPrefix()', () => {
  it('creates a new instance', () => {
    const a = new Splitter({ data: [] })
    const b = a.withPrefix([])
    expect(b).not.toBe(a)
  })

  it('creates an instance with modified prefix', () => {
    const prefix = Buffer.from('prefix')

    expect(
      new Splitter({ data: [] })
        .withPrefix(prefix)
    ).toEqual(
      new Splitter({ data: [], prefix })
    )
  })
})

describe('withSuffix()', () => {
  it('creates a new instance', () => {
    const a = new Splitter({ data: [] })
    const b = a.withSuffix([])
    expect(b).not.toBe(a)
  })

  it('creates an instance with modified suffix', () => {
    const suffix = Buffer.from('prefix')

    expect(
      new Splitter({ data: [] })
        .withSuffix(suffix)
    ).toEqual(
      new Splitter({ data: [], suffix })
    )
  })
})

describe('withIndent()', () => {
  it('calls withPrefix()', async () => {
    expect(
      new Splitter({ data: [] })
        .withIndent(4)
    ).toEqual(
      new Splitter({ data: [] })
        .withPrefix(Buffer.from(' '.repeat(4)))
    )
  })
})
