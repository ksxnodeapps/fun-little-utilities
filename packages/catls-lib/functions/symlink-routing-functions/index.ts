import { SymlinkRoutingFunctions } from '../../types'
import { SymlinkResolution } from '../../enums'
import Return = SymlinkRoutingFunctions.Return
import FileSystemFunctions = SymlinkRoutingFunctions.FileSystemFunctions
import StatGetter = SymlinkRoutingFunctions.StatGetter
import LinkGetter = SymlinkRoutingFunctions.LinkGetter
import LoopGetter = SymlinkRoutingFunctions.LoopGetter
const { Agnostic, Relative, Ultimate } = SymlinkResolution

const symFns = Symbol()
abstract class ReturnInstance implements Return {
  protected [symFns]: FileSystemFunctions
  public abstract readonly getStat: StatGetter
  public abstract readonly getLink: LinkGetter
  public abstract readonly getLoop: LoopGetter

  constructor (fsfn: FileSystemFunctions) {
    this[symFns] = fsfn
  }
}

class AgnosticFunctions extends ReturnInstance {
  public readonly getStat: StatGetter = this[symFns].stat
  public readonly getLink: LinkGetter = 'Something goes wrong: Should not end up calling this' as any
  public readonly getLoop: LoopGetter = () => () => 0
}

class RelativeFunctions extends ReturnInstance {
  public readonly getStat: StatGetter = this[symFns].lstat
  public readonly getLink: LinkGetter = this[symFns].readlink
  public readonly getLoop: LoopGetter = body => (a, b, c) => body(a, b, c)
}

class UltimateFunctions extends ReturnInstance {
  public readonly getStat: StatGetter = this[symFns].lstat
  public readonly getLink: LinkGetter = this[symFns].realpath
  public readonly getLoop: LoopGetter = body => name => body(name, 0, [])
}

function symlinkRoutingFunctions (
  resolution: SymlinkResolution,
  fsfn: FileSystemFunctions
): Return {
  switch (resolution) {
    case Agnostic:
      return new AgnosticFunctions(fsfn)
    case Relative:
      return new RelativeFunctions(fsfn)
    case Ultimate:
      return new UltimateFunctions(fsfn)
  }
}

export = symlinkRoutingFunctions
