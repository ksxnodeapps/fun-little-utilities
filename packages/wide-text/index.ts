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
    charSep?: number
    wordSep?: number
  }
}

export = createWideText
