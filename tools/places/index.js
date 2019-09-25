'use strict'
const { join } = require('path')
const project = join(__dirname, '../..')
const packages = join(project, 'packages')
const test = join(project, 'test')
const tools = join(project, 'tools')
const docs = join(project, 'docs')
Object.defineProperty(exports, '__esModule', { value: true })
Object.assign(exports, { project, packages, test, tools, docs, default: exports })
