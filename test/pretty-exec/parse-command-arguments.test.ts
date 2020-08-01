import {
  ParsingResult,
  parseSingleCommandArgument,
  parseCommandArguments,
} from 'pretty-exec'

describe('parseSingleCommandArguments', () => {
  it('"argument"', () => {
    expect(parseSingleCommandArgument('argument')).toEqual({
      type: ParsingResult.Type.Argument,
      text: 'argument',
    })
  })

  it('"--flag"', () => {
    expect(parseSingleCommandArgument('--flag')).toEqual({
      type: ParsingResult.Type.Flag,
      text: '--flag',
    })
  })

  it('"-flag"', () => {
    expect(parseSingleCommandArgument('-flag')).toEqual({
      type: ParsingResult.Type.Flag,
      text: '-flag',
    })
  })

  it('"--option-key=option-value"', () => {
    expect(parseSingleCommandArgument('--option-key=option-value')).toEqual({
      type: ParsingResult.Type.Option,
      text: '--option-key=option-value',
      key: '--option-key',
      value: 'option-value',
    })
  })
})

describe('parseCommandArguments', () => {
  it('matches snapshot', () => {
    const args = ['-o', 'output', '--force', '--foo=bar', '--', 'abc', '--not-flag']
    expect(parseCommandArguments(args)).toMatchSnapshot()
  })
})
