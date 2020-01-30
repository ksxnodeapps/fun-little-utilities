import { EventEmitter } from 'events'
import { ChildProcess } from 'catls-lib'
import { StreamInstance } from 'simple-fake-stream'

export class ChildProcessInstance extends EventEmitter implements ChildProcess {
  public readonly stdout = new StreamInstance()
  public readonly stderr = new StreamInstance()
}

export default ChildProcessInstance
