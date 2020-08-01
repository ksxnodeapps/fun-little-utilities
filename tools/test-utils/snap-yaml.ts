import { DumpOptions, makeYamlText } from './make-yaml-text'

export const snapYaml = (object: any, options?: DumpOptions) => expect(makeYamlText(object, options)).toMatchSnapshot()

export default snapYaml
