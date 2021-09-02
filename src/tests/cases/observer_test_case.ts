import { DOMTestCase } from "./dom_test_case"

export interface Observer {
  start(): void
  stop(): void
}

export class ObserverTestCase extends DOMTestCase {
  observer!: Observer
  calls: any[][] = []
  private setupCallCount = 0

  async setup() {
    this.observer.start()
    await this.nextFrame
    this.setupCallCount = this.calls.length
  }

  async teardown() {
    this.observer.stop()
  }

  get testCalls() {
    return this.calls.slice(this.setupCallCount)
  }

  recordCall(methodName: string, ...args: any[]) {
    this.calls.push([methodName, ...args])
  }
}
