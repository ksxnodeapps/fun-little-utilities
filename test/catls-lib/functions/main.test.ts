import { Omit } from 'utility-types'
import ramda from 'ramda'
import * as shQuote from 'shell-quote'
import { Prepend } from 'typescript-tuple'
import { StreamInstance, getString } from 'simple-fake-stream'
import FakeChildProcess from '../.lib/fake-child-process'

import {
  main,
  Main,
  SymlinkResolution,
  EmptyArgumentHandlingMethod,
  ExitStatus
} from 'catls-lib'

import {
  fsPromise,
  fsPromiseDict,
  allDictKeys,
  DictKey,
  ItemType
} from '../.lib/fake-file-system-sample'

type OptionalParamKey =
  'stdout' |
  'stderr' |
  'cat' |
  'ls' |
  'addStatusCode' |
  'spawn' |
  'fsPromise'

type InitParam = Readonly<Omit<Main.Param, OptionalParamKey>>

const cat = 'cat'
const ls = 'ls'
const interactive = '--interactive'

const spawn = jest.fn(function localSpawn (cmd: string, argv: ReadonlyArray<string>): FakeChildProcess {
  if (cmd === 'script') {
    const argvLast = ramda.last(argv) as string
    const [nextCmd, ...nextArgv] = shQuote.parse(argvLast)
    return localSpawn(nextCmd, [...nextArgv, interactive])
  }

  const str = JSON.stringify
  const [flags, list] = ramda.partition(x => x[0] === '-', argv)
  const cp = new FakeChildProcess()
  const { stdout, stderr } = cp

  setTimeout(async () => {
    const procCat = (act: () => void) => {
      if (cmd === cat) act()
    }

    const procLs = (act: () => void) => {
      if (cmd === ls) act()
    }

    let promise = Promise.resolve()

    const emitData = (stream: StreamInstance<string | Buffer>, data: string | Buffer) => {
      promise = promise.then(() => stream.asyncEmit('data', data))
    }

    const out = (text: string | Buffer) => () => emitData(stdout, String(text) + '\n')
    const err = (text: string | Buffer) => () => emitData(stderr, String(text) + '\n')

    if (flags.length) {
      out(`(Received Flags: ${flags.join(' ')})`)()
      if (flags.includes(interactive)) out(`(Interactive Mode)`)()
      out('\n')()
    }

    function read (name: string): void {
      if (name in fsPromiseDict) {
        const key: DictKey = name as any
        const value = fsPromiseDict[key]

        switch (value.type) {
          case ItemType.Symlink:
            return read(value.content)
          case ItemType.File:
            procCat(out(value.content))
            procLs(err(`Unexpected: Calling ${str(ls)} on ${str(name)}`))
            break
          case ItemType.Directory:
            procCat(out(`Unexpected: Calling ${str(cat)} on ${str(name)}`))
            procLs(err(value.content.join('\n')))
            break
          default:
            procCat(out(`Unexpected: Calling ${str(cat)} on ${str(name)}`))
            procLs(err(`Unexpected: Calling ${str(ls)} on ${str(name)}`))
        }
      } else {
        err(`Unexpected: Calling spawn on ${str(name)}`)()
      }
    }

    list.forEach(read)

    await promise
    stdout.emit('close')
    stderr.emit('close')
    cp.emit('close', ExitStatus.Success)
  }, 100)

  return cp
})

function init (param: InitParam) {
  const stdout = new StreamInstance()
  const stderr = new StreamInstance()
  const status = main({
    addStatusCode: (a, b) => a + b,
    stdout,
    stderr,
    cat,
    ls,
    spawn,
    fsPromise,
    ...param
  })
  return { stdout, stderr, status }
}

function start () {
  type DescFunc<Factor> = (factor: Factor) => string

  interface Layer<Factor, Base extends MaybeLayer<any, any>> {
    readonly factorList: Factor[]
    readonly getDescription: DescFunc<Factor>
    readonly base: Base
    readonly run: (fn: RunCallback<Base>) => void
  }

  type MaybeLayer<
    Factor,
    Base extends MaybeLayer<any, any>
  > = Layer<Factor, Base> | undefined

  type RunCallback<
    Type extends MaybeLayer<any, any>,
    Holder extends any[] = []
  > = {
    undefined:
      (param: Holder) => void,
    defined:
      Type extends Layer<infer Factor, infer Base> ?
      Base extends MaybeLayer<any, any> ?
        RunCallback<Base, Prepend<Holder, Factor>>
      : { ERROR: 'Base does not fit MaybeLayer<any, any>', Base: Base }
      : { ERROR: 'Type does not fit Layer<any, any>', Type: Type }
    invalidType:
      { ERROR: 'Type does not fit MaybeLayer<any, any>', Type: Type, Holder: Holder }
  }[
    Type extends undefined ? 'undefined' :
    Type extends Layer<any, any> ? 'defined' :
    'invalidType'
  ]

  const add = <Factor, Base extends MaybeLayer<any, any>> (
    factorList: Factor[],
    getDescription: DescFunc<Factor>,
    base: Base
  ): Layer<Factor, Base> => ({
    factorList,
    getDescription,
    base,
    run: (() => {
      const { makeParam, execute } = base
        ? {
          makeParam: (factor: Factor, baseParam: any[]) => [...baseParam, factor],
          execute: base.run as (fn: RunCallback<Base>) => void
        }
        : {
          makeParam: (factor: Factor) => [factor],
          execute: (fn: RunCallback<Base>) => void fn([])
        }

      return (fn: RunCallback<Base>) => execute((baseParam: any[]) => {
        for (const factor of factorList) {
          const param = makeParam(factor, baseParam)
          describe(getDescription(factor), () => fn(param))
        }
      })
    })()
  })

  interface Result<Base extends MaybeLayer<any, any>> {
    add<Factor> (
      factorList: Factor[],
      getDescription: DescFunc<Factor>
    ): Result<Layer<Factor, Base>>

    run (fn: RunCallback<Base>): void

    base: Base
  }

  const mkres = <
    Base extends MaybeLayer<any, any>
  > (base: Base): Result<Base> => ({
    add<Factor> (
      factorList: Factor[],
      getDescription: DescFunc<Factor>
    ) {
      return mkres(add(factorList, getDescription, base))
    },
    run: base ? base.run : () => undefined,
    base
  })

  return mkres(undefined)
}

const allSymlinkRslns = [
  SymlinkResolution.Agnostic,
  SymlinkResolution.Relative,
  SymlinkResolution.Ultimate
]

const allEmptyArgsMtds = [
  EmptyArgumentHandlingMethod.Error,
  EmptyArgumentHandlingMethod.Quiet,
  EmptyArgumentHandlingMethod.Warn
]

type HasLength<Length = number> = { readonly length: Length }
type DescMaker<X = any> = (name: string) => (x: X) => string
const desc = (name: string, x: any) =>
  `when ${name} is ${x}`
const descEmpty: DescMaker<HasLength> = name => ({ length }) =>
  desc(name, length ? `an array of ${length} elements` : 'empty')
const descJSON: DescMaker = name => x =>
  desc(name, JSON.stringify(x))

const suites = start()
  .add([[], allDictKeys], descEmpty('list'))
  .add(allSymlinkRslns, descJSON('symlinkResolution'))
  .add([false, true], descJSON('dontFakeInteractive'))
  .add(['0', '1', '2', '∞'], descJSON('followSymlink'))
  .add(allEmptyArgsMtds, descJSON('handleEmptyArguments'))
  .add([[], ['--catA', '--catB']], descEmpty('catArguments'))
  .add([[], ['--lsA', '--lsB']], descEmpty('lsArguments'))
  .add([[], ['--sharedA', '--sharedB']], descEmpty('sharedArguments'))

beforeAll(() => {
  jest.setTimeout(12345)
})

afterAll(() => {
  jest.setTimeout(5000)
})

suites.run(param => {
  const [
    list,
    symlinkResolution,
    dontFakeInteractive,
    followSymlink,
    handleEmptyArguments,
    catArguments,
    lsArguments,
    sharedArguments
  ] = param

  const { status, stderr, stdout } = init({
    list,
    symlinkResolution,
    dontFakeInteractive,
    followSymlink,
    handleEmptyArguments,
    catArguments,
    lsArguments,
    sharedArguments
  })

  const mkfn = (fn: (status: number) => void) => () => status.then(fn)

  const prependByLines = (text: string, prefix: string) => text.trim()
    .split('\n')
    .map(line => line.trim() ? prefix + line : '')
    .join('\n')

  const indent = ' '.repeat(2)

  const formatString = (text: string) => text
    ? '\n\n' + prependByLines(text, indent) + '\n'
    : '<empty string>'

  const mkSnFn = (fn: () => string) => mkfn(() => {
    expect(formatString(fn())).toMatchSnapshot()
  })

  it('status matches snapshot', mkfn(status => expect(status).toMatchSnapshot()))
  it('stdout matches snapshot', mkSnFn(() => getString(stdout)))
  it('stderr matches snapshot', mkSnFn(() => getString(stderr)))
})
