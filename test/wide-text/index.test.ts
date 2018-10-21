import createWideText from 'wide-text'

it('works without options', () => {
  expect(createWideText('foo bar baz')).toBe('f o o  b a r  b a z')
  expect(createWideText('a bc def')).toBe('a  b c  d e f')
})

it('works with specified charSep', () => {
  const options = { charSep: '.' }
  expect(createWideText('foo bar baz', options)).toBe('f.o.o  b.a.r  b.a.z')
  expect(createWideText('a bc def', options)).toBe('a  b.c  d.e.f')
})

it('works with specified wordSep', () => {
  const options = { wordSep: ' : ' }
  expect(createWideText('foo bar baz', options)).toBe('f o o : b a r : b a z')
  expect(createWideText('a bc def', options)).toBe('a : b c : d e f')
})

it('works with specified charSep and wordSep', () => {
  const options = { charSep: '.', wordSep: ':' }
  expect(createWideText('foo bar baz', options)).toBe('f.o.o:b.a.r:b.a.z')
  expect(createWideText('a bc def', options)).toBe('a:b.c:d.e.f')
})
