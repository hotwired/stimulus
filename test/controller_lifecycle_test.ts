import { testGroup, test, setFixture, queryFixture, getControllerSelector, TestController } from "./test_helpers"

testGroup("Controller lifecycle", function() {
  test("intialize, connect, disconnect callbacks",  async function (assert) {
    const done = assert.async()

    const identifier = "test"
    this.application.register(identifier, TestController)

    await setFixture(`<div data-controller="${identifier}"></div>`)
    const element = queryFixture(getControllerSelector(identifier))
    const controller = this.application.getControllerForElementAndIdentifier(element, identifier)
    assert.deepEqual(controller.lifecycle, { initialize: 1, connect: 1, disconnect: 0 })

    await setFixture("")
    assert.deepEqual(controller.lifecycle, { initialize: 1, connect: 1, disconnect: 1 })

    await setFixture(element)
    assert.deepEqual(controller.lifecycle, { initialize: 1, connect: 2, disconnect: 1 })

    done()
  })
})
