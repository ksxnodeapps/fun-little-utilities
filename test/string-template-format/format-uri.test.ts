import { formatUri, formatUriComponent } from 'string-template-format'

describe('formatUri', () => {
  it('abc/{def}/{ghi}', () => {
    expect(formatUri`abc/${'def'}/${'ghi'}`).toBe('abc/def/ghi')
  })

  it('abc/{def}/{ghi/jkl}', () => {
    expect(formatUri`abc/${'def'}/${'ghi/jkl'}`).toBe('abc/def/ghi/jkl')
  })

  it('abc/{def}/{ghi jkl mno}', () => {
    expect(formatUri`abc/${'def'}/${'ghi jkl mno'}`).toBe('abc/def/ghi%20jkl%20mno')
  })
})

describe('formatUriComponent', () => {
  it('abc/{def}/{ghi}', () => {
    expect(formatUriComponent`abc/${'def'}/${'ghi'}`).toBe('abc/def/ghi')
  })

  it('abc/{def}/{ghi/jkl}', () => {
    expect(formatUriComponent`abc/${'def'}/${'ghi/jkl'}`).toBe('abc/def/ghi%2Fjkl')
  })

  it('abc/{def}/{ghi jkl mno}', () => {
    expect(formatUriComponent`abc/${'def'}/${'ghi jkl mno'}`).toBe('abc/def/ghi%20jkl%20mno')
  })
})
