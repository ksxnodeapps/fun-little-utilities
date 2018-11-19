import {
  dirname,
  join,
  sep
} from 'path'

function relativeLink (link: string, target: string): string {
  const [first] = target.split(/\/|\\/)

  return first === '' || /a-z+:/.test(first)
    ? target
    : notRoot(link, target)

  function notRoot (link: string, target: string): string {
    const [first, ...rest] = target.split(/\/|\\/)

    switch (first) {
      case '.':
        return notRoot(link, rest.join(sep))
      case '..':
        return notRoot(dirname(link), rest.join(sep))
      default:
        return join(dirname(link), target)
    }
  }
}

export = relativeLink
