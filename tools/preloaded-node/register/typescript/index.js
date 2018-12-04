require('../json5')

const { config } = require('@tools/typescript')
const { compilerOptions } = require(config)

require('ts-node').register({
  typeCheck: true,
  ignoreDiagnostics: [
    2554,
    7031
  ],
  compilerOptions: {
    ...compilerOptions,
    noUnusedLocals: false,
    noUnusedParameters: false
  }
})
