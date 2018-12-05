import chalk from 'chalk'

function styledArgument (text: string): string {
  if (/^-/.test(text)) return chalk.dim(text)
  return text
}

function commandTitle (script: string, args: ReadonlyArray<string>): string {
  const styledScript = chalk.yellow(script)
  const styledArgs = args.map(styledArgument).join(' ')
  return `$ ${styledScript} ${styledArgs}`
}

export = commandTitle
