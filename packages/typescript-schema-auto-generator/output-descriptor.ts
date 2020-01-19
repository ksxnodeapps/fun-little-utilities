import ensureArray from './utils/ensure-array'
import { MaybeArray } from './utils/types'
import { OutputDescriptor } from './types'

export const ensureOutputDescriptor =
  (maybeDesc: string | OutputDescriptor) =>
    typeof maybeDesc === 'string' ? { filename: maybeDesc } : maybeDesc

export const ensureOutputDescriptorArray =
  (maybeDesc: MaybeArray<string | OutputDescriptor>): OutputDescriptor[] =>
    ensureArray(maybeDesc).map(ensureOutputDescriptor)
