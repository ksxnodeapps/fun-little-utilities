import Tag from './tag'

/**
 * Type of value to pass to `formatJson`
 */
export type JsonValue = JsonObject | JsonArray | null | boolean | number | string

interface JsonObject {
  readonly [_: string]: JsonValue
}

interface JsonArray extends Array<JsonValue> {}

/**
 * Convert values to JSON string
 */
export const formatJson: Tag<JsonValue> = Tag(JSON.stringify)
export default formatJson
