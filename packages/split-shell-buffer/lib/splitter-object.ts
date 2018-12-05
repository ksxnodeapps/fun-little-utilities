import * as types from './types'

class SplitterObject implements types.Splitter {
  public readonly data: types.Data
  public readonly prefix: types.SequenceFunc
  public readonly suffix: types.SequenceFunc

  constructor (options: types.ConstructorOptions) {
    this.data = options.data
    this.prefix = options.prefix || []
    this.suffix = options.suffix || []
  }

  public withPrefix (prefix: types.SequenceFunc): SplitterObject {
    const { data, suffix } = this
    return new SplitterObject({ data, prefix, suffix })
  }

  public withSuffix (suffix: types.SequenceFunc): SplitterObject {
    const { data, prefix } = this
    return new SplitterObject({ data, prefix, suffix })
  }

  public withIndent (indent: number): SplitterObject {
    return this.withPrefix(
      Buffer.from(' '.repeat(indent))
    )
  }
}

export = SplitterObject
