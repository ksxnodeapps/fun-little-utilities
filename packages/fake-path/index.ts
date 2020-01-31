export const symCwd = Symbol('cwd')
export const symRoot = Symbol('root')

type StringKey<Object> = {
  [key in string & keyof Object]: Object[key]
}

export type Path = StringKey<FakePath>

const isEmpty = (path: string) => path === '.' || path === ''
const normalizeEmptyPath = (path: string) => isEmpty(path) ? '.' : path

export abstract class FakePath {
  public abstract readonly [symCwd]: string
  public abstract readonly [symRoot]: readonly string[]
  public abstract readonly sep: string

  public readonly isAbsolute = (path: string): boolean =>
    this[symRoot].some(root => path.startsWith(root))

  public readonly join = (...paths: string[]): string => {
    if (!paths.length) return '.'
    const [head, ...rest] = paths
    const tail = this.join(...rest)
    if (isEmpty(head)) return tail
    if (isEmpty(tail)) return head
    if (tail === '..') return this.dirname(head)
    if (tail.startsWith('..' + this.sep)) {
      return this.join(this.dirname(head), tail.slice(('..' + this.sep).length))
    }
    const left = head.endsWith(this.sep) ? head.slice(0, -1) : head
    const right = tail.startsWith(this.sep) ? tail.slice(1) : tail
    return this.normalize(left + this.sep + right)
  }

  public readonly resolve = (...paths: string[]): string => {
    if (!paths.length) return '.'
    const [head, ...rest] = paths
    const tail = this.resolve(...rest)
    if (this.isAbsolute(tail)) return tail
    return this.join(this[symCwd], head, tail)
  }

  public readonly dirname = (path: string): string => {
    if (path === '' || path === '.' || path === this.sep) return path
    const segments = path.split(this.sep).slice(0, -1)
    if (!segments.length) return '.'
    return this.normalize(this.join(...segments))
  }

  public readonly basename = (path: string): string => {
    const segments = path.split(this.sep)
    return this.normalize(segments[segments.length - 1])
  }

  public readonly normalize = (path: string): string => {
    if (isEmpty(path)) return '.'
    if (path.startsWith(this.sep)) {
      const tail = this.normalize(path.slice(this.sep.length))
      return this.sep + tail
    }
    const segments = path
      .split(this.sep)
      .filter(x => !isEmpty(x))
    // tslint:disable-next-line:one-variable-per-declaration
    for (let i = 0, j = 1; j < segments.length; ++i, ++j) {
      if (segments[j] === '..') {
        segments[i] = segments[j] = ''
      }
    }
    const result = segments.filter(Boolean).join(this.sep)
    return normalizeEmptyPath(result)
  }
}

export default FakePath
