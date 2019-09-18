export enum ErrorKind {
  ENOENT = -2,
  EEXIST = -17,
  ENOTDIR = -20,
  EISDIR = -21
}

export type ErrorCode = string & keyof typeof ErrorKind

export type SysCall =
  'stat' |
  'scandir' |
  'open' |
  'read' |
  'mkdir'

export class ENOENT<Path> {
  public readonly errno = ErrorKind.ENOENT
  public readonly code = ErrorKind[ErrorKind.ENOENT]
  constructor (
    public readonly syscall: SysCall,
    public readonly path: Path
  ) {}
}

export class EEXIST<Path> {
  public readonly errno = ErrorKind.EEXIST
  public readonly code = ErrorKind[ErrorKind.EEXIST]
  constructor (
    public readonly syscall: SysCall,
    public readonly path: Path
  ) {}
}

export class ENOTDIR<Path> {
  public readonly errno = ErrorKind.ENOTDIR
  public readonly code = ErrorKind[ErrorKind.ENOTDIR]
  constructor (
    public readonly syscall: SysCall,
    public readonly path: Path
  ) {}
}

export class EISDIR<Path> {
  public readonly errno = ErrorKind.EISDIR
  public readonly code = ErrorKind[ErrorKind.EISDIR]
  constructor (
    public readonly syscall: SysCall,
    public readonly path: Path
  ) {}
}

export enum ContentKind {
  File = 'File',
  Directory = 'Directory',
  None = 'None',
  Error = 'Error'
}

class None {
  public readonly kind = ContentKind.None
}

const NONE = new None()

class ErrorCarrier<Value> {
  public readonly kind = ContentKind.Error
  constructor (public readonly value: Value) {}
}

class FakeStats<FS extends Content<any, any>> {
  constructor (public readonly fs: FS) {}
  public readonly isFile = () => this.fs.kind === ContentKind.File
  public readonly isDirectory = () => this.fs.kind === ContentKind.Directory
}

export class FakeFileContent<Content> {
  public readonly kind = ContentKind.File
  constructor (public readonly content: Content) {}
}

export class FakeDirectoryContent<PathElm, FileContent> extends Map<
  PathElm,
  Content<PathElm, FileContent>
> {
  public readonly kind = ContentKind.Directory

  public hasPath (path: Iterable<PathElm>) {
    const { kind } = this.getPath(path)
    return kind === ContentKind.File || kind === ContentKind.Directory
  }

  public getPath (
    path: Iterable<PathElm>,
    original = () => Array.from(path)
  ): MaybeContent<
    PathElm,
    FileContent,
    ENOTDIR<PathElm[]>
  > {
    const [first, ...rest] = path
    const content = this.get(first)
    if (!content) return NONE
    if (content.kind === ContentKind.File) {
      if (rest.length) return new ErrorCarrier(new ENOTDIR('scandir', original()))
      return content
    }
    if (rest.length) {
      return this.getPath(rest, original)
    }
    return this
  }

  public setPath (
    path: Iterable<PathElm>,
    value: Content<PathElm, FileContent>,
    original = () => Array.from(path)
  ): ENOENT<PathElm[]> | ENOTDIR<PathElm[]> | null {
    const [first, ...rest] = path
    if (rest.length) {
      const child = this.get(first)
      if (!child) return new ENOENT('open', original())
      if (child.kind !== ContentKind.Directory) return new ENOTDIR('open', original())
      return child.setPath(rest, value)
    }
    this.set(first, value)
    return null
  }

  public ensurePath (
    path: Iterable<PathElm>,
    value: Content<PathElm, FileContent>,
    original = () => Array.from(path)
  ): ENOTDIR<PathElm[]> | null {
    const [first, ...rest] = path
    if (rest.length) {
      const child = this.get(first)
      if (!child) {
        const next = new FakeDirectoryContent<PathElm, FileContent>()
        const error = next.ensurePath(rest, value, original)
        if (error) return error
        this.set(first, next)
        return null
      }
      if (child.kind !== ContentKind.Directory) {
        return new ENOTDIR('open', original())
      }
      return child.ensurePath(rest, value)
    }
    this.set(first, value)
    return null
  }
}

export type Content<PathElm, FileContent> =
  FakeFileContent<FileContent> |
  FakeDirectoryContent<PathElm, FileContent>

type MaybeContent<PathElm, FileContent, ErrorValue> =
  None |
  ErrorCarrier<ErrorValue> |
  Content<PathElm, FileContent>

export class ArrayPathFileSystem<PathElm, FileContent> {
  private coreMap = new FakeDirectoryContent<PathElm, FileContent>()

  public existsSync (path: Iterable<PathElm>) {
    return this.coreMap.hasPath(path)
  }

  public statSync (path: Iterable<PathElm>) {
    const content = this.coreMap.getPath(path)
    switch (content.kind) {
      case ContentKind.None:
        throw new ENOENT('stat', path)
      case ContentKind.Error:
        throw content.value
    }
    return new FakeStats(content)
  }

  public readdirSync (dirname: Iterable<PathElm>) {
    const content = this.coreMap.getPath(dirname)
    switch (content.kind) {
      case ContentKind.Directory:
        return Array.from(content.keys())
      case ContentKind.File:
        throw new ENOTDIR('scandir', dirname)
      case ContentKind.None:
        throw new ENOENT('scandir', dirname)
      case ContentKind.Error:
        throw content.value
    }
  }

  public readFileSync (filename: Iterable<PathElm>) {
    const content = this.coreMap.getPath(filename)
    switch (content.kind) {
      case ContentKind.File:
        return content.content
      case ContentKind.Directory:
        throw new EISDIR('read', filename)
      case ContentKind.None:
        throw new ENOENT('open', filename)
      case ContentKind.Error:
        throw content.value
    }
  }

  public mkdirSync (dirname: Iterable<PathElm>) {
    if (this.coreMap.getPath(dirname).kind !== ContentKind.None) {
      throw new EEXIST('mkdir', dirname)
    }
    const error = this.coreMap.setPath(dirname, new FakeDirectoryContent())
    if (error) throw error
  }

  public writeFileSync (filename: Iterable<PathElm>, fileContent: FileContent) {
    const content = this.coreMap.getPath(filename)
    switch (content.kind) {
      case ContentKind.File:
      case ContentKind.None:
        const error = this.coreMap.setPath(filename, new FakeFileContent(fileContent))
        if (error) throw error
        break
      case ContentKind.Directory:
        throw new EISDIR('open', filename)
      case ContentKind.Error:
        throw content.value
    }
  }
}

export class StringPathFileSystem {
  private readonly core = new ArrayPathFileSystem<string, string>()

  constructor (private readonly sep: string) {}

  private normalize (item: string) {
    return item === '.' ? '' : item
  }

  private split (path: string) {
    return path
      .split(this.sep)
      .map(this.normalize)
      .filter(Boolean)
  }

  public existsSync (path: string) {
    return this.core.existsSync(this.split(path))
  }

  public statSync (path: string) {
    return this.core.statSync(this.split(path))
  }

  public readdirSync (path: string) {
    return this.core.readdirSync(this.split(path))
  }

  public mkdirSync (path: string) {
    this.core.mkdirSync(this.split(path))
  }

  public readFileSync (path: string) {
    return this.core.readFileSync(this.split(path))
  }

  public writeFileSync (path: string, fileContent: string) {
    this.core.writeFileSync(this.split(path), fileContent)
  }
}
