import assert from 'static-type-assert'
import * as sfc from 'simple-fake-console'

assert<sfc.Console>(global.console)
assert<sfc.Console>(new sfc.ConsoleInstance())
