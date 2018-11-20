import path from 'path'
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
        return notRoot(link, rest.join(path.sep))
      case '..':
        return notRoot(path.dirname(link), rest.join(path.sep))
      default:
        return path.join(path.dirname(link), target)
    }
  }
}

export = relativeLink
