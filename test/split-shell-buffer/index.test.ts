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

describe('indented styled text matches snapshot', () => {
  expect(
    Splitter
      .fromString(styledText)
      .withIndent(2)
      .toString()
  ).toMatchSnapshot()
})

describe('indentation part of indented styled text only contain spaces and leading reset sequence', () => {
  const indent = 4
  const regex = /^(\x1B\[(0|;)*m)? {4}/

  expect(
    Splitter
      .fromString(styledText)
      .withIndent(indent)
      .toString()
      .split('\n')
      .every(text => regex.test(text))
  ).toBe(true)
})
