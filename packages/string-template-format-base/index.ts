/**
 * Individual formatter
 */
export interface Formatter<Raw> {
  /**
   * @param raw Value to format
   * @returns Text representation of `value`
   */
  (raw: Raw): string
}

/**
 * Type of template literal tag
 */
export interface TemplateTag<Raw, Return = string> {
  /**
   * @param strings Template strings
   * @param raws Values to format
   * @returns Formatted text
   */
  (strings: readonly string[], ...raws: Raw[]): Return
}

/**
 * Create a template literal tag
 * @param fmt Formatter to use
 * @returns Template literal tag
 */
export const tag = <Raw>(fmt: Formatter<Raw>): TemplateTag<Raw> =>
  (strings, ...raws) => {
    const diff = strings.length - raws.length
    if (diff !== 1) {
      throw new RangeError(`strings and values number difference is not 1 but ${diff}`)
    }

    let result = strings[raws.length]

    while (raws.length) {
      const formatted = fmt(raws.pop()!)
      result = strings[raws.length] + formatted + result
    }

    return result
  }

export const TemplateTag = tag
export default TemplateTag
