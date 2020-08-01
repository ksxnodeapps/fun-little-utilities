/** Create a promise that resolves after a certain amount of time */
export const callSetTimeout = (
  setTimeout: (fn: () => void, ms: number) => void,
  delay: number,
) => new Promise<void>(resolve => setTimeout(() => resolve(), delay))

/** Create a promise that resolves after a certain amount of time */
export const simpleDelay = (delay: number) => callSetTimeout(setTimeout, delay)

export default simpleDelay
