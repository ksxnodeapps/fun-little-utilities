import { sep } from 'path'
import { PATH_SEP_REGEX } from 'catls-lib'
export = (path: string) => path.split(PATH_SEP_REGEX).join(sep)
