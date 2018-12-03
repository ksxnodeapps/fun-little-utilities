import { stat, lstat, readlink, realpath } from 'fs-extra'
import { SymlinkRoutingFunctions } from '../../types'
import { SymlinkResolution } from '../../enums'
import Return = SymlinkRoutingFunctions.Return
import StatGetter = SymlinkRoutingFunctions.StatGetter
import LinkGetter = SymlinkRoutingFunctions.LinkGetter
import LoopGetter = SymlinkRoutingFunctions.LoopGetter
const { Agnostic, Relative, Ultimate } = SymlinkResolution

class AgnosticFunctions implements Return {
  public readonly getStat: StatGetter = stat
  public readonly getLink: LinkGetter = 'Something goes wrong: Should not end up calling this' as any
  public readonly getLoop: LoopGetter = () => () => 0
}

class RelativeFunctions implements Return {
  public readonly getStat: StatGetter = lstat
  public readonly getLink: LinkGetter = readlink
  public readonly getLoop: LoopGetter = body => (a, b, c) => body(a, b, c)
}

class UltimateFunctions implements Return {
  public readonly getStat: StatGetter = lstat
  public readonly getLink: LinkGetter = realpath
  public readonly getLoop: LoopGetter = body => name => body(name, 0, [])
}

function symlinkRoutingFunctions (resolution: SymlinkResolution): Return {
  switch (resolution) {
    case Agnostic:
      return new AgnosticFunctions()
    case Relative:
      return new RelativeFunctions()
    case Ultimate:
      return new UltimateFunctions()
  }
}

export = symlinkRoutingFunctions
