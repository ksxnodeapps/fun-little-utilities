import { StreamDatabase } from './stream'

export function getString<
  Chunk extends string | Buffer,
  Err = any
> (stream: StreamDatabase<Chunk, Err>): string {
  return stream
    .getChunks()
    .map(x => String(x))
    .join('')
}
