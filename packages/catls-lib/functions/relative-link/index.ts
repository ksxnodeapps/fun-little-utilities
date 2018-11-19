import {
  dirname,
  join,
  sep
} from 'path'

function relativeLink (link: string, target: string): string {
  const [first, ...rest] = target.split(/\/|\\/)

  switch (first) {
    case '.':
      return relativeLink(link, rest.join(sep))
    case '..':
      return relativeLink(dirname(link), rest.join(sep))
    default:
      return join(dirname(link), target)
  }
}

export = relativeLink
