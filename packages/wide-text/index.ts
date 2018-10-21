/**
 * Create wide text from normal text
 * @param text Input text
 * @param options Options
 */
function createWideText (text: string, options: createWideText.Options = {}) {
  const {
    charSep = 1,
    wordSep = 2
  } = options

  const actualCharSep = ' '.repeat(charSep)
  const actualWordSep = ' '.repeat(wordSep)

  return text
    .split(' ')
    .map(word => Array.from(word).join(actualCharSep))
    .join(actualWordSep)
}

namespace createWideText {
  export interface Options {
    /**
     * Number of spaces between characters in a word
     */
    charSep?: number

    /**
     * Number of spaces between words
     */
    wordSep?: number
  }
}

export = createWideText
