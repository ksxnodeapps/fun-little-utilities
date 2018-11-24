export const normalText = [
  'abc def ghi',
  'jkl mno pqrs'
].join('\n')

export const styledText = [
  'abc \x1B[1mdef \x1B[2m',
  'ghi \x1B[0;0mjkl \x1B[91;22;3m',
  'mno pqrs \x1B[m',
  'tuv wxyz',
  '01 \x1B[2m23 \x1B[1m45',
  '67 \x1B[m89',
  'foo',
  'bar'
].join('\n')
