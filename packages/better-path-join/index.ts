interface PathModule<Path> {
  readonly isAbsolute: (path: Path) => boolean
  readonly join: (left: Path, right: Path) => Path
}

interface JoinFunction<Path> {
  /**
   * Join two path together
   * @param left Base path
   * @param right Continuing path
   * @returns `path.join(left, right)` if `right` is relative, or just `right` otherwise
   */
  (left: Path, right: Path): Path
}

/**
 * Create a function that joins two paths
 * @param pathModule An object that has `join` and `isAbsolute` function
 */
export function createJoinFunction<Path>(pathModule: PathModule<Path>): JoinFunction<Path> {
  const { isAbsolute, join } = pathModule
  return (left, right) => isAbsolute(right) ? right : join(left, right)
}

export default createJoinFunction
