import { dirname, join, sep } from 'path'
import { PATH_SEP_REGEX, WIN_ROOT_REGEX } from '../../constants'

function relativeLink (link: string, target: string): string {
  const [first] = target.split(PATH_SEP_REGEX)

  return first === '' || WIN_ROOT_REGEX.test(first)
    ? target
    : notRoot(link, target)

  function notRoot (link: string, target: string): string {
    const [first, ...rest] = target.split(PATH_SEP_REGEX)

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
