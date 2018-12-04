import yargs from 'yargs'
import { CommandLineOptions, SymlinkResolution } from 'catls-lib'
const { Agnostic, Relative, Ultimate } = SymlinkResolution

const coerceSubArgs = (list: string) => list.split(/\s*,\s*/)

function getCliArgs (): CommandLineOptions & yargs.Arguments {
  const { argv } = yargs
    .alias('h', 'help')
    .option('cat', {
      alias: ['cmdCat', 'c'],
      describe: 'Cat program',
      type: 'string',
      default: 'cat'
    })
    .option('ls', {
      alias: ['cmdLs', 'ls'],
      describe: 'Ls program',
      type: 'string',
      default: 'ls'
    })
    .option('dontFakeInteractive', {
      alias: ['noInteractive', 'noScript', 'n'],
      describe: 'Do not use script command',
      type: 'boolean'
    })
    .option('handleNonArguments', {
      alias: ['onZeroArgs', 'z'],
      describe: 'Follow symlink, value can be a natural number or Infinite',
      type: 'string',
      default: '0'
    })
    .option('symlinkResolution', {
      alias: 'symlink',
      describe: 'How to treat symbolic links',
      choices: [Agnostic, Relative, Ultimate],
      default: Relative
    })
    .option('sharedArguments', {
      alias: ['arguments', 'args', 'A'],
      describe: 'Comma-separated list of additional arguments to pass to cat and ls',
      type: 'string',
      coerce: coerceSubArgs,
      default: ''
    })
    .option('lsArguments', {
      alias: ['lsArgs', 'L'],
      describe: 'Comma-separated list of additional arguments to pass to ls',
      type: 'string',
      coerce: coerceSubArgs,
      default: ''
    })
    .option('catArguments', {
      alias: ['catArgs', 'C'],
      describe: 'Comma-separated list of additional arguments to pass to cat',
      type: 'string',
      coerce: coerceSubArgs,
      default: ''
    })

  return argv as any
}

export = getCliArgs
