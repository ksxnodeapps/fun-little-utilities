/**
 * Types of JSON scalars
 */
export type JsonScalar = null | boolean | number | string

/**
 * Type of JSON values that cannot be modified
 */
export type ReadonlyJsonValue<Other = never> =
  | ReadonlyJsonObject<Other>
  | ReadonlyJsonArray<Other>
  | JsonScalar
  | Other

/**
 * Type of JSON objects that cannot be modified
 */
export interface ReadonlyJsonObject<Other = never> {
  readonly [_: string]: ReadonlyJsonValue<Other>
}

/**
 * Type of JSON arrays that cannot be modified
 */
export interface ReadonlyJsonArray<Other> extends ReadonlyArray<ReadonlyJsonValue<Other>> {}

/**
 * Type of JSON values that can be modified if it is object or array
 */
export type WritableJsonValue<Other = never> =
  | WritableJsonObject<Other>
  | WritableJsonArray<Other>
  | JsonScalar
  | Other

/**
 * Type of JSON objects that can be modified
 */
export interface WritableJsonObject<Other> {
  [_: string]: WritableJsonValue<Other>
}

/**
 * Type of JSON arrays that can be modified
 */
export interface WritableJsonArray<Other> extends Array<WritableJsonValue<Other>> {}

/**
 * Type of `replacer` callback in `dump`
 */
export interface Replacer {
  /**
   * Transform a value before serialization
   * @param this Object that contains property `[key]: value`
   * @param key Property key
   * @param value Property value
   * @returns New value
   */
  (
    this: WritableJsonObject<WritableJsonValue<never>>,
    key: string,
    value: WritableJsonValue<never>,
  ): ReadonlyJsonValue<never> | undefined
}

/**
 * Type of `reviver` callback in `load`
 */
export interface Reviver<Return> {
  /**
   * Transform a value after deserialization
   * @param this Object that contains property `[key]: value`
   * @param key Property key
   * @param value Property value
   * @returns New value
   */
  (
    this: WritableJsonObject<never>,
    key: string,
    value: WritableJsonValue<never>,
  ): Return
}

/**
 * Type of `dump` function
 */
export interface Dumper {
  /**
   * Convert a JavaScript value to a JSON string
   * @param value Value to be converted
   * @param replacer Function that transforms the result
   * @param space Indentation
   * @returns Valid JSON string
   */
  <Other = never>(
    value: ReadonlyJsonValue<Other>,
    replacer?: Replacer,
    space?: number | string,
  ): string
}

/**
 * Type of `load` function
 */
export interface Loader {
  /**
   * Convert a JSON string into a JavaScript value
   * @param text Valid JSON string
   * @param reviver Function that transforms the result
   * @returns JavaScript value
   */
  <Other = never>(
    text: string,
    reviver?: Reviver<ReadonlyJsonValue<Other> | WritableJsonValue<Other> | Other>,
  ): WritableJsonValue<Other>
}

/**
 * Convert a JavaScript value to a JSON string
 */
export const dump: Dumper = JSON.stringify

/**
 * Convert a JSON string into a JavaScript value
 */
export const load: Loader = JSON.parse
