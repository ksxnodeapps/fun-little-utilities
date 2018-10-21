import { compare } from 'semver'
import { Version } from 'sort-versions-types'

export = (versions: Iterable<Version>, loose?: boolean): Version[] =>
  Array.from(versions).sort((a, b) => compare(a, b, loose))
