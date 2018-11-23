import Splitter from 'split-shell-buffer'

describe('toString()', () => {
  const normalText = [
    'abc def ghi',
    'jkl mno pqrs'
  ].join('\n')

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
