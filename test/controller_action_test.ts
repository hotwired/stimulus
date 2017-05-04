import { testGroup, test, setFixture, queryFixture, getControllerSelector, getActionSelector, triggerEvent, TestController } from "./test_helpers"

testGroup("Controller action", function () {
  test("inline <button>", async function (assert) {
    const done = assert.async()

    const identifier = "test"
    this.application.register(identifier, TestController)

    await setFixture(`
      <div data-controller="${identifier}">
        <button data-action="${identifier}#foo">Foo</button>
      </div>
    `)

    const element = queryFixture(getControllerSelector(identifier))
    const buttonElement = queryFixture(getActionSelector(identifier, "foo"))
    const controller = this.application.getControllerForElementAndIdentifier(element, identifier)

    triggerEvent(buttonElement, "click")
    assert.equal(controller.actions.length, 1)
    assert.deepEqual(controller.actions[0], { eventType: "click", eventPrevented: true, eventTarget: buttonElement, target: buttonElement })

    done()
  })

  test("inline <button> with child element", async function (assert) {
    const done = assert.async()

    const identifier = "test"
    this.application.register(identifier, TestController)

    await setFixture(`
      <div data-controller="${identifier}">
        <button data-action="${identifier}#foo">
          <span>Foo</span>
        </button>
      </div>
    `)

    const element = queryFixture(getControllerSelector(identifier))
    const buttonElement = queryFixture(getActionSelector(identifier, "foo"))
    const buttonChildElement = buttonElement.firstChild as Element
    const controller = this.application.getControllerForElementAndIdentifier(element, identifier)

    triggerEvent(buttonChildElement, "click")
    assert.equal(controller.actions.length, 1)
    assert.deepEqual(controller.actions[0], { eventType: "click", eventPrevented: true, eventTarget: buttonChildElement, target: buttonElement })

    done()
  })
})
