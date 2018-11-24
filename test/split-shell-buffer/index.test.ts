import Splitter from 'split-shell-buffer'

const normalText = [
  'abc def ghi',
  'jkl mno pqrs'
].join('\n')

const styledText = [
  'abc \x1B[1mdef \x1B[2m',
  'ghi \x1B[0;0mjkl \x1B[91;22;3m',
  'mno pqrs \x1B[m',
  'tuv wxyz',
  '01 \x1B[2m23 \x1B[1m45',
  '67 \x1B[m89',
  'foo',
  'bar'
].join('\n')

it('correctly indents normal text', () => {
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

it('correctly indents styled text', () => {
  expect(
    Splitter
      .fromString(styledText)
      .withIndent(2)
      .toString()
  ).toMatchSnapshot()
})
