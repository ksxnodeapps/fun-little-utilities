import Tag from 'string-template-format-base'

/**
 * Type of objects that can be passed to `formatToString`
 */
export interface ToStringObject {
  readonly toString: () => string
}

/**
 * Type of values that can be passed to `formatToString`
 */
export type ToStringValue = ToStringObject | undefined | null

/**
 * Format any value that is convertible to string
 * (i.e. can be passed to `String`)
 */
export const formatToString = Tag(String as (raw: ToStringValue) => string)
export { formatToString as toString, formatToString as str }
export default formatToString
