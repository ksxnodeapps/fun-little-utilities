import { ReadonlyJsonValue, dump } from 'just-json-type'
import Tag from './tag'

/**
 * Type of value to pass to `formatJson`
 */
export type JsonValue = ReadonlyJsonValue

/**
 * Convert values to JSON string
 */
export const formatJson: Tag<JsonValue> = Tag(dump)
export default formatJson
