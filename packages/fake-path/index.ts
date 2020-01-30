export const symCwd = Symbol('cwd')
export const symRoot = Symbol('root')

export abstract class FakePath {
  public abstract readonly [symCwd]: string
  public abstract readonly [symRoot]: readonly string[]
  public abstract readonly sep: string
  public readonly cwd = (): string => this[symCwd]

  public readonly isAbsolute = (path: string): boolean =>
    this[symRoot].some(root => path.startsWith(root))

  public readonly join = (...paths: string[]): string => {
    if (!paths.length) return '.'
    const [head, ...rest] = paths
    const tail = this.join(...rest)
    if (head === '.') return tail
    if (tail === '.') return head
    if (tail.startsWith('..' + this.sep)) {
      return this.join(this.dirname(head), tail.slice(('..' + this.sep).length))
    }
    const left = head.endsWith(this.sep) ? head.slice(0, -1) : head
    const right = tail.startsWith(this.sep) ? tail.slice(1) : tail
    return left + this.sep + right
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
    return this.join(...segments)
  }

  public readonly basename = (path: string): string => {
    const segments = path.split(this.sep)
    return segments[segments.length - 1]
  }
}
