import { Application } from "stimulus"
import { testGroup, test, getFixture, nextFrame, TestController } from "./test_helpers"

testGroup("Application", function() {
  test("Application.start()", function(assert) {
    const app = Application.start()
    assert.ok(app instanceof Application)
  })

  test("only connects controllers while started", async function(assert) {
    const done = assert.async()

    const identifier1 = "test1"
    const identifier2 = "test2"

    this.application.register(identifier1, TestController)
    this.application.register(identifier2, TestController)

    const element1 = document.createElement("div")
    element1.setAttribute("data-controller", identifier1)

    const element2 = document.createElement("div")
    element2.setAttribute("data-controller", identifier2)

    getFixture().appendChild(element1)
    await nextFrame()

    const controller1 = this.application.getControllerForElementAndIdentifier(element1, identifier1)
    assert.ok(controller1)
    assert.notOk(this.application.getControllerForElementAndIdentifier(element2, identifier2))
    assert.deepEqual(controller1.lifecycle, { initialize: 1, connect: 1, disconnect: 0 })

    this.application.stop()
    getFixture().appendChild(element2)
    await nextFrame()

    assert.notOk(this.application.getControllerForElementAndIdentifier(element2, identifier2))
    assert.deepEqual(controller1.lifecycle, { initialize: 1, connect: 1, disconnect: 0 })

    this.application.start()
    await nextFrame()

    const controller2 = this.application.getControllerForElementAndIdentifier(element2, identifier2)
    assert.ok(controller2)
    assert.deepEqual(controller1.lifecycle, { initialize: 1, connect: 1, disconnect: 0 })
    assert.deepEqual(controller2.lifecycle, { initialize: 1, connect: 1, disconnect: 0 })

    done()
  })
})

