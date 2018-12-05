import yargs from 'yargs'
import { CommandLineOptions, EmptyArgumentHandlingMethod, SymlinkResolution } from 'catls-lib'
const { Quiet, Warn, Error } = EmptyArgumentHandlingMethod
const { Agnostic, Relative, Ultimate } = SymlinkResolution

const coerceSubArgs = (list: string) => list.split(/\s*,\s*/).filter(Boolean)

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
      alias: ['cmdLs', 'l'],
      describe: 'Ls program',
      type: 'string',
      default: 'ls'
    })
    .option('dontFakeInteractive', {
      alias: ['noInteractive', 'noScript', 'n'],
      describe: 'Do not use script command',
      type: 'boolean'
    })
    .option('handleEmptyArguments', {
      alias: ['onZeroArgs', 'z'],
      describe: 'What to do when there is no arguments',
      choices: [Quiet, Warn, Error],
      default: Error
    })
    .option('followSymlink', {
      alias: 'follow',
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
    .help()

  return argv as any
}

export = getCliArgs
