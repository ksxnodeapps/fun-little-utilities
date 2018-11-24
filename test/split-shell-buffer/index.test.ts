import Splitter from 'split-shell-buffer'

const normalText = [
  'abc def ghi',
  'jkl mno pqrs'
].join('\n')

it('correctly indents', () => {
  const indentedNormalText = [
    '  abc def ghi',
    '  jkl mno pqrs'
  ].join('\n')

  expect(
    Splitter
      .fromString(normalText)
      .withPrefix(Buffer.from('  '))
      .toString()
  ).toBe(
    Splitter
      .fromString(indentedNormalText)
      .toString()
  )
})
