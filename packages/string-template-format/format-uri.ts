import Tag from './tag'

/**
 * Format string into valid URI
 */
export const formatUri = Tag(encodeURI)

/**
 * Format string into valid URI component
 */
export const formatUriComponent = Tag(encodeURIComponent)
