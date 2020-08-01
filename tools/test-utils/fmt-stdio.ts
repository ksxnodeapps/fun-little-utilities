const EMPTY = '((EMPTY))'

export function fmtStdIO(stdio: unknown): string {
  if (!stdio) return EMPTY
  if (typeof stdio !== 'string') return fmtStdIO(String(stdio))

  if (!stdio.trim()) return EMPTY

  return stdio
}

export default fmtStdIO
