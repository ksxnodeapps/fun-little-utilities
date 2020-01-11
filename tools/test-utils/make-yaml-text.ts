import { DumpOptions, dump } from 'js-yaml'

export { DumpOptions }
export const DEFAULT_DUMP_OPTIONS: DumpOptions = Object.freeze({
  sortKeys: true
})

export const makeYamlText = (
  object: any,
  options = DEFAULT_DUMP_OPTIONS
) => '\n' + dump(object, options) + '\n'

export default makeYamlText
