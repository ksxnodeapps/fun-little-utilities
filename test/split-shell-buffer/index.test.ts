import Splitter from 'split-shell-buffer'

it('preserves normal text', () => {
  const text = [
    'abc def ghi',
    'jkl mno pqrs'
  ].join('\n')

  expect(
    Splitter
      .fromString(text)
      .toString()
  ).toEqual(text)
})
