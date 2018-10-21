import createWideText from 'wide-text'

it('works without options', () => {
  expect(createWideText('foo bar baz')).toBe('f o o  b a r  b a z')
  expect(createWideText('a bc def')).toBe('a  b c  d e f')
})

it('works with specified charSep', () => {
  const options = { charSep: 0 }
  expect(createWideText('foo bar baz', options)).toBe('foo  bar  baz')
  expect(createWideText('a bc def', options)).toBe('a  bc  def')
})

it('works with specified wordSep', () => {
  const options = { wordSep: 3 }
  expect(createWideText('foo bar baz', options)).toBe('f o o   b a r   b a z')
  expect(createWideText('a bc def', options)).toBe('a   b c   d e f')
})

it('works with specified charSep and wordSep', () => {
  const options = { charSep: 0, wordSep: 3 }
  expect(createWideText('foo bar baz', options)).toBe('foo   bar   baz')
  expect(createWideText('a bc def', options)).toBe('a   bc   def')
})
