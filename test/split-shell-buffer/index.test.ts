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
      .withIndent(2)
      .toString()
  ).toBe(
    Splitter
      .fromString(indentedNormalText)
      .toString()
  )
})
