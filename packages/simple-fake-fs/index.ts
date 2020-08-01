export enum ErrorKind {
  ENOENT = -2,
  EEXIST = -17,
  ENOTDIR = -20,
  EISDIR = -21,
}

export type ErrorCode = string & keyof typeof ErrorKind

export type SysCall =
  | 'stat'
  | 'scandir'
  | 'open'
  | 'read'
  | 'mkdir'
  | 'exists'

interface ErrorConstructor<Return, Path> {
  new (syscall: SysCall, path: Path): Return
}

export class ENOENT<Path> {
  public readonly errno = ErrorKind.ENOENT
  public readonly code = ErrorKind[ErrorKind.ENOENT]
  constructor(
    public readonly syscall: SysCall,
    public readonly path: Path,
  ) {}
}

export class EEXIST<Path> {
  public readonly errno = ErrorKind.EEXIST
  public readonly code = ErrorKind[ErrorKind.EEXIST]
  constructor(
    public readonly syscall: SysCall,
    public readonly path: Path,
  ) {}
}

export class ENOTDIR<Path> {
  public readonly errno = ErrorKind.ENOTDIR
  public readonly code = ErrorKind[ErrorKind.ENOTDIR]
  constructor(
    public readonly syscall: SysCall,
    public readonly path: Path,
  ) {}
}

export class EISDIR<Path> {
  public readonly errno = ErrorKind.EISDIR
  public readonly code = ErrorKind[ErrorKind.EISDIR]
  constructor(
    public readonly syscall: SysCall,
    public readonly path: Path,
  ) {}
}

export enum ContentKind {
  File = 'File',
  Directory = 'Directory',
  None = 'None',
  Error = 'Error',
}

const EMPTY_CLASS = class {}

class None {
  public readonly kind = ContentKind.None
}

const NONE = new None()

class ErrorCarrier<Value> {
  public readonly kind = ContentKind.Error
  constructor(public readonly value: Value) {}
}

export class FakeStats<FS extends Content<any, any>> {
  constructor(private readonly fs: FS) {}
  public readonly isFile = () => this.fs.kind === ContentKind.File
  public readonly isDirectory = () => this.fs.kind === ContentKind.Directory
}

export class FakeFileContent<Content> {
  public readonly kind = ContentKind.File
  constructor(public readonly content: Content) {}
}

interface FileSystemEntry<PathElm, FileContent> extends ReadonlyArray<any> {
  readonly 0: PathElm
  readonly 1: Content<PathElm, FileContent> | readonly FileSystemEntry<PathElm, FileContent>[]
}

export class FakeDirectoryContent<PathElm, FileContent> extends Map<
  PathElm,
  Content<PathElm, FileContent>,
> {
  public readonly kind = ContentKind.Directory

  constructor(entries: readonly FileSystemEntry<PathElm, FileContent>[] = []) {
    super(entries.map(([key, value]) => {
      if (value instanceof FakeFileContent || value instanceof FakeDirectoryContent) {
        return [key, value]
      }

      const newValue = new FakeDirectoryContent(value)
      return [key, newValue] as const
    }))
  }

  public hasPath(path: readonly PathElm[]) {
    const { kind } = this.getPath(path, 'exists', EMPTY_CLASS, EMPTY_CLASS)
    return kind === ContentKind.File || kind === ContentKind.Directory
  }

  public getPath<ERP, EFD>(
    path: readonly PathElm[],
    syscall: SysCall,
    RedundantPath: ErrorConstructor<ERP, PathElm[]>,
    FileAsDir: ErrorConstructor<EFD, PathElm[]>,
    original = () => Array.from(path),
  ): MaybeContent<
    PathElm,
    FileContent,
    ERP | EFD
  > {
    if (!path.length) return this
    const [first, ...rest] = path
    const next = this.get(first)
    if (!next) {
      return rest.length ? new ErrorCarrier(new RedundantPath(syscall, original())) : NONE
    }
    if (next.kind !== ContentKind.Directory) {
      return rest.length ? new ErrorCarrier(new FileAsDir(syscall, original())) : next
    }
    return next.getPath(rest, syscall, RedundantPath, FileAsDir, original)
  }

  public setPath<ENE, EFD>(
    path: readonly PathElm[],
    value: Content<PathElm, FileContent>,
    syscall: SysCall,
    NotExist: ErrorConstructor<ENE, PathElm[]>,
    FileAsDir: ErrorConstructor<EFD, PathElm[]>,
    original = () => Array.from(path),
  ): ENE | EFD | null {
    const [first, ...rest] = path
    if (rest.length) {
      const child = this.get(first)
      if (!child) return new NotExist(syscall, original())
      if (child.kind !== ContentKind.Directory) return new FileAsDir(syscall, original())
      return child.setPath(rest, value, syscall, NotExist, FileAsDir, original)
    }
    this.set(first, value)
    return null
  }

  public ensurePath<EFD>(
    path: readonly PathElm[],
    value: Content<PathElm, FileContent>,
    syscall: SysCall,
    FileAsDir: ErrorConstructor<EFD, PathElm[]>,
    original = () => Array.from(path),
  ): EFD | null {
    const [first, ...rest] = path
    if (rest.length) {
      const child = this.get(first)
      if (!child) {
        const next = new FakeDirectoryContent<PathElm, FileContent>()
        const error = next.ensurePath(rest, value, syscall, FileAsDir, original)
        if (error) return error
        this.set(first, next)
        return null
      }
      if (child.kind !== ContentKind.Directory) {
        return new FileAsDir(syscall, original())
      }
      return child.ensurePath(rest, value, syscall, FileAsDir, original)
    }
    this.set(first, value)
    return null
  }
}

export type Content<PathElm, FileContent> =
  | FakeFileContent<FileContent>
  | FakeDirectoryContent<PathElm, FileContent>

type MaybeContent<PathElm, FileContent, ErrorValue> =
  | None
  | ErrorCarrier<ErrorValue>
  | Content<PathElm, FileContent>

export class ArrayPathFileSystem<PathElm, FileContent> {
  private coreMap: FakeDirectoryContent<PathElm, FileContent>

  constructor(entries?: readonly FileSystemEntry<PathElm, FileContent>[]) {
    this.coreMap = new FakeDirectoryContent(entries)
  }

  public existsSync = (path: readonly PathElm[]) => this.coreMap.hasPath(path)

  public statSync = (path: readonly PathElm[]) => {
    const content = this.coreMap.getPath(path, 'stat', ENOENT, ENOTDIR)
    switch (content.kind) {
      case ContentKind.None:
        throw new ENOENT('stat', path)
      case ContentKind.Error:
        throw content.value
    }
    return new FakeStats(content)
  }

  public readdirSync = (dirname: readonly PathElm[]) => {
    const content = this.coreMap.getPath(dirname, 'scandir', ENOENT, ENOTDIR)
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

  public readFileSync = (filename: readonly PathElm[]) => {
    const content = this.coreMap.getPath(filename, 'read', ENOENT, ENOTDIR)
    switch (content.kind) {
      case ContentKind.File:
        return content.content
      case ContentKind.Directory:
        throw new EISDIR('read', filename)
      case ContentKind.None:
        throw new ENOENT('read', filename)
      case ContentKind.Error:
        throw content.value
    }
  }

  public mkdirSync = (dirname: readonly PathElm[]) => {
    switch (this.coreMap.getPath(dirname, 'mkdir', EMPTY_CLASS, EMPTY_CLASS).kind) {
      case ContentKind.File:
      case ContentKind.Directory:
        throw new EEXIST('mkdir', dirname)
    }
    const error = this.coreMap.setPath(dirname, new FakeDirectoryContent(), 'mkdir', ENOENT, ENOTDIR)
    if (error) throw error
  }

  public writeFileSync = (filename: readonly PathElm[], fileContent: FileContent) => {
    if (this.coreMap.getPath(filename, 'open', EMPTY_CLASS, EMPTY_CLASS).kind === ContentKind.Directory) {
      throw new EISDIR('open', filename)
    }
    const error = this.coreMap.setPath(filename, new FakeFileContent(fileContent), 'open', ENOENT, ENOTDIR)
    if (error) throw error
  }

  public ensureDirSync = (dirname: readonly PathElm[]) => {
    switch (this.coreMap.getPath(dirname, 'mkdir', ENOENT, ENOTDIR).kind) {
      case ContentKind.File:
        throw new ENOTDIR('mkdir', dirname)
      case ContentKind.Directory:
        return
    }
    const error = this.coreMap.ensurePath(dirname, new FakeDirectoryContent(), 'mkdir', ENOTDIR)
    if (error) throw error
  }

  public outputFileSync = (filename: readonly PathElm[], content: FileContent) => {
    if (this.coreMap.getPath(filename, 'open', ENOENT, ENOTDIR).kind === ContentKind.Directory) {
      throw new EISDIR('open', filename)
    }
    const error = this.coreMap.ensurePath(filename, new FakeFileContent(content), 'open', ENOTDIR)
    if (error) throw error
  }
}

type StringPathFileSystemDict = {
  readonly [_: string]: StringPathFileSystemDict | string
}

function dict2entries(dict: StringPathFileSystemDict): FileSystemEntry<string, string>[] {
  return Object.entries(dict).map(([key, value]) => {
    if (typeof value === 'string') {
      return [key, new FakeFileContent(value)]
    }

    return [key, dict2entries(value)]
  })
}

export class StringPathFileSystem {
  private readonly core: ArrayPathFileSystem<string, string>

  constructor(
    private readonly sep: string,
    dict: StringPathFileSystemDict = {},
  ) {
    this.core = new ArrayPathFileSystem(dict2entries(dict))
  }

  private normalize(item: string) {
    return item === '.' ? '' : item
  }

  private split(path: string) {
    return path
      .split(this.sep)
      .map(this.normalize)
      .filter(Boolean)
  }

  public existsSync = (path: string) => this.core.existsSync(this.split(path))

  public statSync = (path: string) => this.core.statSync(this.split(path))

  public readdirSync = (path: string) => this.core.readdirSync(this.split(path))

  public mkdirSync = (path: string) => this.core.mkdirSync(this.split(path))

  public readFileSync = (path: string) => this.core.readFileSync(this.split(path))

  public writeFileSync = (path: string, fileContent: string) => this.core.writeFileSync(this.split(path), fileContent)

  public ensureDirSync = (path: string) => this.core.ensureDirSync(this.split(path))

  public outputFileSync = (path: string, fileContent: string) => this.core.outputFileSync(this.split(path), fileContent)

  public ensureFileSync = (path: string) => this.outputFileSync(path, '')
}
