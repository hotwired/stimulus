export class TestCase {
  readonly assert: Assert

  static defineModule(moduleName: string = this.name, qUnit: QUnit = QUnit) {
    qUnit.module(moduleName, hooks => {
      this.manifest.forEach(([type, name]) => {
        type = this.shouldSkipTest(name) ? "skip" : type
        const method = (qUnit as any)[type] as Function
        const test = this.getTest(name)
        method.call(qUnit, name, test)
      })
    })
  }

  static getTest(testName: string) {
    return async (assert: Assert) =>
      this.runTest(testName, assert)
  }

  static runTest(testName: string, assert: Assert) {
    const testCase = new this(assert)
    return testCase.runTest(testName)
  }

  static shouldSkipTest(testName: string): boolean {
    return false
  }

  static get manifest() {
    return this.testPropertyNames.map(name => [name.slice(0, 4), name.slice(5)])
  }

  static get testNames(): string[] {
    return this.manifest.map(([type, name]) => name)
  }

  static get testPropertyNames(): string[] {
    return Object.keys(this.prototype).filter(name => name.match(/^(skip|test|todo) /))
  }

  constructor(assert: Assert) {
    this.assert = assert
  }

  async runTest(testName: string) {
    try {
      await this.setup()
      await this.runTestBody(testName)
    } finally {
      await this.teardown()
    }
  }

  async runTestBody(testName: string) {
    const testCase = (this as any)[`test ${testName}`] || (this as any)[`todo ${testName}`]
    if (typeof testCase == "function") {
      return testCase.call(this)
    } else {
      return Promise.reject(`test not found: "${testName}"`)
    }
  }

  async setup() {
    // Override this method in your subclass to prepare your test environment
  }

  async teardown() {
    // Override this method in your subclass to clean up your test environment
  }
}
