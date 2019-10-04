import { inspect, InspectOptions } from 'util'
import Tag from 'string-template-format-base'

/**
 * Type of formatter that uses Node's `util.inspect`
 */
export interface Inspector {
  /**
   * @param raw Value to format
   * @returns Formatted text
   */
  (raw: any): string
}

/**
 * Create an `Inspector` to pass to `tag`
 * @param options Options to pass to Node's `util.inspect`
 * @returns Formatter that uses Node's `util.inspect`
 */
export const Inspector = (options?: InspectOptions): Inspector =>
  options ? (raw => inspect(raw, options)) : inspect

/**
 * Type of template literal tag that uses Node's `util.inspect`
 */
export type InspectFormatter = Tag<any>

/**
 * Format any value with Node's `util.inspect`
 */
export const formatInspector: InspectFormatter = Tag(inspect)
export { formatInspector as inspect, formatInspector as debug, formatInspector as dbg }

/**
 * Create a template literal tag that uses Node's `util.inspect`
 * @param options Options to pass to Node's `util.inspect`
 */
export const InspectFormatter = (options?: InspectOptions): InspectFormatter => Tag(Inspector(options))
export default InspectFormatter
