export const symCwd = Symbol('cwd')
export const symRoot = Symbol('root')

type StringKey<Object> = {
  [key in string & keyof Object]: Object[key]
}

export type Path = StringKey<FakePath>

const isEmpty = (path: string) => path === '.' || path === ''
const normalizeEmptyPath = (path: string, def = '.') => isEmpty(path) ? def : path

export abstract class FakePath {
  public abstract readonly [symCwd]: string
  public abstract readonly [symRoot]: readonly string[]
  public abstract readonly sep: string

  public readonly isAbsolute = (path: string): boolean => this[symRoot].some(root => path.startsWith(root))

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
    const { isAbsolute, join } = this
    function resolve(paths: readonly string[]): string {
      if (!paths.length) return '.'
      const [head, ...rest] = paths
      const tail = resolve(rest)
      if (isAbsolute(tail)) return tail
      return join(head, tail)
    }
    return resolve([this[symCwd], ...paths])
  }

  public readonly dirname = (path: string): string => {
    if (path === '' || path === '.' || path === this.sep) return path
    if (path.startsWith(this.sep)) {
      const tail = this.dirname(path.slice(this.sep.length))
      return this.sep + normalizeEmptyPath(tail, '')
    }
    const segments = this.normalize(path).split(this.sep).slice(0, -1)
    if (!segments.length) return '.'
    return this.normalize(this.join(...segments))
  }

  public readonly basename = (path: string): string => {
    if (this[symRoot].includes(path)) return ''
    if (path.endsWith(this.sep)) return this.basename(path.slice(0, -this.sep.length))
    const segments = path.split(this.sep)
    return this.normalize(segments[segments.length - 1])
  }

  public readonly normalize = (path: string): string => {
    if (isEmpty(path)) return '.'
    const { sep } = this
    function splitLeadSep(path: string): [number, string] {
      if (!path.startsWith(sep)) return [0, path]
      const [count, tail] = splitLeadSep(path.slice(sep.length))
      return [count + 1, tail]
    }
    const [leadingSep, tail] = splitLeadSep(path)
    if (leadingSep) {
      const nTail = this.normalize(tail)
      return isEmpty(nTail) ? sep : sep + nTail
    }
    function normalize(normal: readonly string[], weird: readonly string[]): string {
      if (!weird.length) return normal.join(sep)
      const [head, ...tail] = weird
      if (head === '..') {
        return normal.length ? normalize(normal.slice(0, -1), tail) : '..' + sep + normalize(normal, tail)
      }
      if (isEmpty(head)) return normalize(normal, tail)
      return normalize([...normal, head], tail)
    }
    return normalizeEmptyPath(normalize([], path.split(sep)))
  }
}

export default FakePath
