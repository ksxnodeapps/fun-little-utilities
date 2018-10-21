import { compare, valid } from 'semver'
import { Version } from 'sort-versions-types'

export = (versions: Iterable<Version>, loose?: boolean): Version[] =>
  Array.from(versions).filter(x => valid(x)).sort((a, b) => compare(a, b, loose))
