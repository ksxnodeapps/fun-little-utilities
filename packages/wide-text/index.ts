import { Options } from 'wide-text-types'

/**
 * Create wide text from normal text
 * @param text Input text
 * @param options Options
 */
export function createWideText(text: string, options: Options = {}) {
  const {
    charSep = 1,
    wordSep = 2,
  } = options

  const actualCharSep = ' '.repeat(charSep)
  const actualWordSep = ' '.repeat(wordSep)

  return text
    .split(' ')
    .map(word => Array.from(word).join(actualCharSep))
    .join(actualWordSep)
}

export default createWideText
