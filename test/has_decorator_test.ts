import { testGroup, test } from "./test_helpers"
import { has } from "stimulus"

testGroup("@has decorator", () => {
  test("singular property calls find", assert => {
    const controller = createFixture("titleElement")
    assert.deepEqual(["find", "title"], controller.titleElement)
  })

  test("plural property calls findAll", assert => {
    const controller = createFixture("linkElements")
    assert.deepEqual(["findAll", "link"], controller.linkElements)
  })

  test("multiple properties", assert => {
    const controller = createFixture("titleElement", "buttonElement", "linkElements")
    assert.deepEqual(["find", "title"], controller.titleElement)
    assert.deepEqual(["find", "button"], controller.buttonElement)
    assert.deepEqual(["findAll", "link"], controller.linkElements)
  })

  test("throws on unknown suffix", assert => {
    assert.throws(() => createFixture("button"))
    assert.throws(() => createFixture("buttonTarget"))
  })
})

function createFixture(...args): any {
  @has(...args) class TestController extends Controller { }
  return new TestController
}

class Controller {
  context: any
  targets: TargetSet

  constructor() {
    this.context = {}
    this.targets = new TargetSet
  }
}

class TargetSet {
  find(name: string) {
    return ["find", name]
  }

  findAll(name: string) {
    return ["findAll", name]
  }
}
