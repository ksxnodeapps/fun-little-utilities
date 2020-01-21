import { Result } from '@tsfun/result'
import { Config } from './types'

export interface FileFormatDescriptor {
  /**
   * Should the loader accept the file?
   * @param filename Path to the file
   */
  readonly testFileName: (filename: string) => boolean

  /**
   * Parse the file
   * @param text Content of the file in text
   * @param filename Path to the file
   */
  readonly parseConfigText: (text: string, filename: string) => Result<Config, unknown>
}
