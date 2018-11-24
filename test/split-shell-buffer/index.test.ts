import Splitter from 'split-shell-buffer'

const normalText = [
  'abc def ghi',
  'jkl mno pqrs'
].join('\n')

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
  it('default options', () => {
    expect(
      Splitter
        .fromString(normalText)
        .toString()
    ).toEqual(
      Splitter
        .fromString(normalText)
        .toString({ finalNewLine: false, encoding: 'utf8' })
    )
  })

  describe('preserves normal text', () => {
    it('without options', () => {
      expect(
        Splitter
          .fromString(normalText)
          .toString()
      ).toEqual(normalText)
    })

    it('with finalNewLine = true', () => {
      expect(
        Splitter
          .fromString(normalText)
          .toString({ finalNewLine: true })
      ).toEqual(normalText + '\n')
    })

    it('with encoding = "hex"', () => {
      expect(
        Splitter
          .fromString(normalText)
          .toString({ encoding: 'hex' })
      ).toEqual(
        Buffer.from(normalText).toString('hex')
      )
    })
  })
})

describe('write()', () => {
  const splitter = Splitter.fromString(normalText)

  it('pass instances of Buffer to writable.write', () => {
    splitter.write({
      write (instance) {
        expect(instance).toBeInstanceOf(Buffer)
      }
    })
  })

  it('pass buffers by line to writable.write', () => {
    let count = 0

    splitter.write({
      write () {
        count += 1
      }
    })

    expect(count).toBe(normalText.split('\n').length)
  })

  it('pass buffers that resemble original text to writable.write', () => {
    let text = ''

    splitter.write({
      write (buffer) {
        text += buffer.toString()
      }
    })

    expect(text).toBe(normalText)
  })
})

describe('writeln()', () => {
  const splitter = Splitter.fromString(normalText)

  it('pass instances of Buffer to writable.write', () => {
    splitter.writeln({
      write (instance) {
        expect(instance).toBeInstanceOf(Buffer)
      }
    })
  })

  it('pass buffers by line to writable.write', () => {
    let count = 0

    splitter.writeln({
      write () {
        count += 1
      }
    })

    expect(count).toBe(normalText.split('\n').length)
  })

  it('pass buffers that resemble original text with trailing eol to writable.write', () => {
    let text = ''

    splitter.writeln({
      write (buffer) {
        text += buffer.toString()
      }
    })

    expect(text).toBe(normalText + '\n')
  })
})
