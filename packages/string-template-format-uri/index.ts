import Tag from 'string-template-format-base'

/**
 * Format string into valid URI
 */
export const formatUri = Tag(encodeURI)
export { formatUri as uri }

/**
 * Format string into valid URI component
 */
export const formatUriComponent = Tag(encodeURIComponent)
export { formatUriComponent as uriComp }
