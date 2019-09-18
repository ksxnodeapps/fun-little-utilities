import path from 'path'

export function relativeLink (link: string, target: string): string {
  return path.isAbsolute(target)
    ? target
    : path.join(path.dirname(link), target)
}

export default relativeLink
