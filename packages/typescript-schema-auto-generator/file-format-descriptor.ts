import { Result, tryExec } from '@tsfun/result'
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

export async function createJsonFormatDescriptor (): Promise<FileFormatDescriptor> {
  const { extname } = await import('path')
  const EXT = ['.json', '']
  const testFileName = (filename: string) => EXT.includes(extname(filename))
  const parseConfigText = (text: string) => tryExec(() => JSON.parse(text))
  return { testFileName, parseConfigText }
}

export async function createYamlFormatDescriptor (): Promise<FileFormatDescriptor> {
  const { extname } = await import('path')
  const { safeLoad } = await import('js-yaml')
  const EXT = ['.yaml', '.yml', '']
  const testFileName = (filename: string) => EXT.includes(extname(filename))
  const parseConfigText = (text: string, filename: string) => tryExec(() => safeLoad(text, { filename }))
  return { testFileName, parseConfigText }
}
