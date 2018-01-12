export class TestCase {
  readonly assert: Assert

  static defineModule(moduleName: string, qUnit: QUnit = QUnit) {
    qUnit.module(moduleName, hooks => {
      this.testNames.forEach(testName => {
        qUnit.test(testName, this.getTest(testName))
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

  static get testNames(): string[] {
    return Object.keys(this.prototype)
      .filter(name => name.match(/^test /))
      .map(name => name.slice(5))
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
    const testCase = this[`test ${testName}`]
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
