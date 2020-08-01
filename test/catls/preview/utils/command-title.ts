import chalk from 'chalk'
const dollar = chalk.bold('$')

function styledArgument(text: string): string {
  if (/^-/.test(text)) return chalk.bold.dim(text)
  return chalk.bold(text)
}

export function commandTitle(script: string, args: ReadonlyArray<string>): string {
  const styledScript = chalk.bold.yellow(script)
  const styledArgs = args.map(styledArgument).join(' ')
  return `${dollar} ${styledScript} ${styledArgs}`
}

export default commandTitle
