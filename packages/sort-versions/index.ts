import { compare, valid, SemVer } from 'semver'

export default
  <Version extends string | SemVer>
    (versions: Iterable<Version>, loose?: boolean): Version[] =>
      Array.from(versions).filter(x => valid(x)).sort((a, b) => compare(a, b, loose))
