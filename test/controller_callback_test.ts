import { Controller } from "stimulus"
import { testGroup, test, createControllerElement, setFixture, triggerEvent } from "./test_helpers"

testGroup("Controller callbacks", function() {
  test("intialize, connect, disconnect",  async function (assert) {
    const done = assert.async()

    const identifier = "test"
    const element = createControllerElement(identifier)
    const counts = { initialize: 0, connect: 0, disconnect: 0 }

    this.application.register(identifier, class extends Controller {
      initialize() { counts.initialize++ }
      connect()    { counts.connect++    }
      disconnect() { counts.disconnect++ }
    })

    await setFixture(element)
    assert.deepEqual(counts, { initialize: 1, connect: 1, disconnect: 0 })

    await setFixture("")
    assert.deepEqual(counts, { initialize: 1, connect: 1, disconnect: 1 })

    await setFixture(element)
    assert.deepEqual(counts, { initialize: 1, connect: 2, disconnect: 1 })
    done()
  })

  test("inline action <button>", async function (assert) {
    const done = assert.async()

    const identifier = "test"
    const element = createControllerElement(identifier, `<button data-${identifier}-action="nextStep">next</button>`)
    const button = element.firstElementChild as HTMLButtonElement

    const actual = { eventCount: 0, eventType: null, eventPrevented: false, eventTarget: null, target: null }
    const expected = { eventCount: 1, eventType: "click", eventPrevented: true, eventTarget: button, target: button }

    this.application.register(identifier, class extends Controller {
      nextStep(event, target) {
        actual.eventCount++
        actual.eventType = event.type
        actual.eventPrevented = event.defaultPrevented
        actual.eventTarget = event.target
        actual.target = target
      }
    })

    await setFixture(element)
    triggerEvent(button, "click")
    assert.deepEqual(actual, expected)
    done()
  })

  test("inline action <button> with child element", async function (assert) {
    const done = assert.async()

    const identifier = "test"
    const element = createControllerElement(identifier, `<button data-${identifier}-action="nextStep"><span>next</span></button>`)
    const button = element.firstElementChild as HTMLButtonElement
    const buttonChild = button.firstElementChild as HTMLSpanElement

    const actual = { eventCount: 0, eventType: null, eventPrevented: false, eventTarget: null, target: null }
    const expected = { eventCount: 1, eventType: "click", eventPrevented: true, eventTarget: buttonChild, target: button }

    this.application.register(identifier, class extends Controller {
      nextStep(event, target) {
        actual.eventCount++
        actual.eventType = event.type
        actual.eventPrevented = event.defaultPrevented
        actual.eventTarget = event.target
        actual.target = target
      }
    })

    await setFixture(element)
    triggerEvent(buttonChild, "click")
    assert.deepEqual(actual, expected)
    done()
  })
})
