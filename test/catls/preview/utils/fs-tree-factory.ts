import path from 'path'
import * as fsx from 'fs-extra'
import * as fsTreeUtils from 'fs-tree-utils'
import tempPath from 'unique-temp-path'
const { Clone, Symlink } = fsTreeUtils.FileSystemRepresentation
const existingDataPath = path.resolve(__dirname, '../data')

export async function create () {
  const targetPath = tempPath()

  const targetTree = {
    data: {
      folder: new Clone(path.join(existingDataPath, 'folder')),
      link: {
        'to-container': new Symlink('.'),
        'to-parent': new Symlink('..'),
        'to-data': new Symlink('../..'),
        'to-folder': new Symlink('../folder')
      },
      link2: {
        'to-to-container': new Symlink('../link/to-container'),
        'to-to-parent': new Symlink('../link/to-parent'),
        'to-to-data': new Symlink('../link/to-data'),
        'to-to-folder': new Symlink('../link/to-folder')
      },
      linkr: {
        a: new Symlink('d'),
        b: new Symlink('a'),
        c: new Symlink('b'),
        d: new Symlink('c')
      }
    }
  }

  await fsTreeUtils.create(targetTree, targetPath)

  const destroy = () => fsx.remove(targetPath)

  return {
    targetPath,
    targetTree,
    destroy
  }
}

export default create
