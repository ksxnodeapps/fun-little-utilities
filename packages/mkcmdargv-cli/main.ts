import process from 'process'
import { safeLoad } from 'js-yaml'
import { Param, iterateCommandArguments, help } from 'mkcmdargv-lib'

const argv = process.argv.slice(2)

const {
  MKCMDARGV_ARGS = '[]',
  MKCMDARGV_OPTIONS = '{}',
  MKCMDARGV_SINGLE_FLAGS = '',
  MKCMDARGV_DOUBLE_FLAGS = ''
} = process.env

class Box<Content> {
  constructor (public readonly content: Content) {}

  public validate<Sub extends Content> (
    fn: (content: Content) => content is Sub,
    error: (content: Content) => Error
  ): Box<Sub> {
    if (fn(this.content)) return new Box(this.content)
    throw error(this.content)
  }
}

function tryParse (text: string, name: string) {
  try {
    return new Box(safeLoad(text))
  } catch (error) {
    console.error(`Failed to parse $${name}`)
    console.error(String(error))
    throw process.exit(1)
  }
}

async function main (): Promise<number> {
  if (argv.includes('help') || argv.includes('--help')) {
    console.info(await help())
    return 0
  }

  const param: Param = {
    args: tryParse(MKCMDARGV_ARGS, 'MKCMDARGV_ARGS')
      .validate(Array.isArray, () => new Error('Expecting an array'))
      .content,
    options: tryParse(MKCMDARGV_OPTIONS, 'MKCMDARGV_OPTIONS')
      .validate(
        (object): object is {} | null => typeof object === 'object',
        () => new Error('Expecting an object')
      )
      .validate(
        Boolean as any as ((x: any) => x is {}),
        () => new Error('Object must not be null')
      )
      .content,
    flags: [
      ...MKCMDARGV_SINGLE_FLAGS,
      ...MKCMDARGV_DOUBLE_FLAGS.split(/\s+/)
    ]
  }

  for (const item of iterateCommandArguments(param)) {
    console.info(item)
  }

  return 0
}

main().then(
  status => process.exit(status),
  error => {
    console.error(error)
    process.exit(-1)
  }
)
