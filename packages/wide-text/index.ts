function createWideText (text: string, options: createWideText.Options = {}) {
  const {
    charSep = ' ',
    wordSep = '  '
  } = options

  return text
    .split(' ')
    .map(word => Array.from(word).join(charSep))
    .join(wordSep)
}

namespace createWideText {
  export interface Options {
    charSep?: string
    wordSep?: string
  }
}

export = createWideText
