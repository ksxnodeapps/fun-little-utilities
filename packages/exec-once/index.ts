export function once<Return> (fn: () => Return): () => Return {
  let main = () => {
    const value = fn()
    main = () => value
    return value
  }

  return () => main()
}

export default once
