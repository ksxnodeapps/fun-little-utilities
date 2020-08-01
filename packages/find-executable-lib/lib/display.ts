import { FindingResult } from './types'
import DisplaySelection from './display-selection'
const { Word, Path, Both } = DisplaySelection

export function display(item: FindingResult.Found, filter: DisplaySelection): string {
  const { word, path } = item

  switch (filter) {
    case Word:
      return word
    case Path:
      return path
    case Both:
      return JSON.stringify({ word, path })
  }
}

export default display
