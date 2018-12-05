import path from 'path'

function relativeLink (link: string, target: string): string {
  return path.isAbsolute(target)
    ? target
    : path.join(path.dirname(link), target)
}

export = relativeLink
