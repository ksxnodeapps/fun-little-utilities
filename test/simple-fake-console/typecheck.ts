import * as sfc from 'simple-fake-console'
import assert from 'static-type-assert'

assert<sfc.Console>(global.console)
assert<sfc.Console>(new sfc.ConsoleInstance())
