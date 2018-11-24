import Splitter from 'split-shell-buffer'
import { normalText, styledText } from './.lib/data'

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
