import { testGroup, test, setFixture, queryFixture, getControllerSelector, getActionSelector, getTargetSelector, triggerEvent, TestController } from "./test_helpers"

testGroup("Controller action", function () {
  test("inline action", async function (assert) {
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
    assert.deepEqual(controller.actions[0], { eventType: "click", eventPrevented: false, eventTarget: buttonElement, target: buttonElement })

    done()
  })

  test("inline action: bubbling from child element", async function (assert) {
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
    assert.deepEqual(controller.actions[0], { eventType: "click", eventPrevented: false, eventTarget: buttonChildElement, target: buttonElement })

    done()
  })

  test("nested inline actions", async function (assert) {
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

  test("multiple inline actions", async function (assert) {
    const done = assert.async()

    const identifier = "test"
    this.application.register(identifier, TestController)

    await setFixture(`
      <div data-controller="${identifier}">
        <button data-action="mousedown->${identifier}#foo mouseup->${identifier}#foo">Foo</button>
      </div>
    `)

    const element = queryFixture(getControllerSelector(identifier))
    const buttonElement = queryFixture("[data-action]")
    const controller = this.application.getControllerForElementAndIdentifier(element, identifier)

    triggerEvent(buttonElement, "mousedown")
    triggerEvent(buttonElement, "mouseup")

    assert.deepEqual(controller.actions, [
      { eventType: "mousedown", eventPrevented: false, eventTarget: buttonElement, target: buttonElement },
      { eventType: "mouseup", eventPrevented: false, eventTarget: buttonElement, target: buttonElement },
    ])

    done()
  })

  test("global inline actions", async function (assert) {
    const done = assert.async()

    const identifier = "test"
    this.application.register(identifier, TestController)

    await setFixture(`
      <div id="outer">
        <div data-controller="${identifier}" data-action="click@window->${identifier}#foo">
          <button data-target="${identifier}.button">Hello</button>
        </div>
      </div>
    `)

    const outerElement = document.getElementById("outer")!
    const element = queryFixture(getControllerSelector(identifier))
    const buttonElement = queryFixture("button")
    const controller = this.application.getControllerForElementAndIdentifier(element, identifier)

    triggerEvent(window, "click")
    triggerEvent(outerElement, "click")
    triggerEvent(buttonElement, "click")

    assert.deepEqual(controller.actions, [
      { eventType: "click", eventPrevented: false, eventTarget: window, target: window },
      { eventType: "click", eventPrevented: false, eventTarget: outerElement, target: window },
      { eventType: "click", eventPrevented: false, eventTarget: buttonElement, target: window },
    ])

    done()
  })

  test("inline actions ignore events triggered in child scopes", async function (assert) {
    const done = assert.async()

    const identifier = "test"
    this.application.register(identifier, TestController)

    await setFixture(`
      <div id="${identifier}_outer" data-controller="${identifier}" data-action="click->${identifier}#foo">
        <a id="${identifier}_outer_link" data-action="click->${identifier}#foo">
          <div id="${identifier}_inner" data-controller="${identifier}" data-action="click->${identifier}#foo">
            <a id="${identifier}_inner_link" data-action="click->${identifier}#foo"></a>
          </div>
        </a>
      </div>
    `)

    const innerLinkElement = document.getElementById(`${identifier}_inner_link`)!
    const innerController = this.application.getControllerForElementAndIdentifier(innerLinkElement.parentElement, identifier)
    const outerLinkElement = document.getElementById(`${identifier}_outer_link`)!
    const outerController = this.application.getControllerForElementAndIdentifier(outerLinkElement.parentElement, identifier)

    triggerEvent(innerLinkElement, "click")

    assert.deepEqual(outerController.actions, [])
    assert.deepEqual(innerController.actions, [
      { eventType: "click", eventPrevented: false, eventTarget: innerLinkElement, target: innerLinkElement },
      { eventType: "click", eventPrevented: false, eventTarget: innerLinkElement, target: innerLinkElement.parentElement },
    ])

    done()
  })
})
