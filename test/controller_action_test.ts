import { testGroup, test, setFixture, queryFixture, getControllerSelector, getActionSelector, getTargetSelector, triggerEvent, TestController } from "./test_helpers"

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
    const buttonChildElement = queryFixture(getActionSelector(identifier, "foo") + " span")
    const controller = this.application.getControllerForElementAndIdentifier(element, identifier)

    triggerEvent(buttonChildElement, "click")
    assert.equal(controller.actions.length, 1)
    assert.deepEqual(controller.actions[0], { eventType: "click", eventPrevented: true, eventTarget: buttonChildElement, target: buttonElement })

    done()
  })

  test("nested inline <button>s", async function (assert) {
    const done = assert.async()

    const identifier1 = "test1"
    const identifier2 = "test2"
    this.application.register(identifier1, TestController)
    this.application.register(identifier2, TestController)

    await setFixture(`
      <div data-controller="${identifier1}">
        <button data-action="${identifier1}#foo">Foo</button>
        <div data-controller="${identifier2}">
          <button data-action="${identifier2}#foo">Foo</button>
        </div>
      </div>
    `)

    const element1 = queryFixture(getControllerSelector(identifier1))
    const element2 = queryFixture(getControllerSelector(identifier2))
    const buttonElement1 = queryFixture(getActionSelector(identifier1, "foo"))
    const buttonElement2 = queryFixture(getActionSelector(identifier2, "foo"))
    const controller1 = this.application.getControllerForElementAndIdentifier(element1, identifier1)
    const controller2 = this.application.getControllerForElementAndIdentifier(element2, identifier2)

    triggerEvent(buttonElement1, "click")
    assert.equal(controller1.actions.length, 1)
    assert.equal(controller2.actions.length, 0)

    triggerEvent(buttonElement2, "click")
    assert.equal(controller1.actions.length, 1)
    assert.equal(controller2.actions.length, 1)

    done()
  })

  test("`on` decorator", async function (assert) {
    const done = assert.async()

    const identifier = "test"
    this.application.register(identifier, TestController)

    await setFixture(`<div data-controller="${identifier}"></div>`)

    const element = queryFixture(getControllerSelector(identifier))
    const controller = this.application.getControllerForElementAndIdentifier(element, identifier)

    triggerEvent(element, "test:default")
    assert.equal(controller.actions.length, 1)

    done()
  })

  test("`on` decorator with target name option", async function (assert) {
    const done = assert.async()

    const identifier = "test"
    const targetName = "foo"
    this.application.register(identifier, TestController)

    await setFixture(`
      <div data-controller="${identifier}">
        <span data-target="${identifier}.${targetName}">Foo</span>
      </div>
    `)

    const element = queryFixture(getControllerSelector(identifier))
    const targetElement = queryFixture(getTargetSelector(identifier, targetName))
    const controller = this.application.getControllerForElementAndIdentifier(element, identifier)

    triggerEvent(targetElement, "test:with-target-name")
    assert.equal(controller.actions.length, 1)

    done()
  })

  test("`on` decorator with event target option", async function (assert) {
    const done = assert.async()

    const identifier = "test"
    this.application.register(identifier, TestController)

    await setFixture(`<div data-controller="${identifier}"></div>`)

    const element = queryFixture(getControllerSelector(identifier))
    const controller = this.application.getControllerForElementAndIdentifier(element, identifier)

    triggerEvent(window, "test:with-event-target")
    assert.equal(controller.actions.length, 1)

    await setFixture("")

    triggerEvent(window, "test:with-event-target")
    assert.equal(controller.actions.length, 1)

    done()
  })
})
