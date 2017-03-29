import { Controller } from "stimulus"
import { testGroup, test, createControllerFixture, setFixture, triggerEvent } from "./test_helpers"

testGroup("Controller", function() {
  test("intialize, connect, disconnect callbacks",  async function (assert) {
    const done = assert.async()

    const f1 = createControllerFixture()
    this.application.register(f1.identifier, f1.constructor)

    await setFixture(f1.element)
    assert.deepEqual(f1.counts, { initialize: 1, connect: 1, disconnect: 0 })

    await setFixture("")
    assert.deepEqual(f1.counts, { initialize: 1, connect: 1, disconnect: 1 })

    await setFixture(f1.element)
    assert.deepEqual(f1.counts, { initialize: 1, connect: 2, disconnect: 1 })
    done()
  })

  test("inline action <button>", async function (assert) {
    const done = assert.async()

    const f1 = createControllerFixture(`<button data-{{identifier}}-action="nextStep">next</button>`)
    const button = f1.element.firstElementChild as HTMLButtonElement

    const actual = { eventCount: 0, eventType: null, eventPrevented: false, eventTarget: null, target: null }
    const expected = { eventCount: 1, eventType: "click", eventPrevented: true, eventTarget: button, target: button }

    this.application.register(f1.identifier, class extends Controller {
      nextStep(event, target) {
        actual.eventCount++
        actual.eventType = event.type
        actual.eventPrevented = event.defaultPrevented
        actual.eventTarget = event.target
        actual.target = target
      }
    })

    await setFixture(f1.element)
    triggerEvent(button, "click")
    assert.deepEqual(actual, expected)
    done()
  })

  test("inline action <button> with child element", async function (assert) {
    const done = assert.async()

    const f1 = createControllerFixture(`<button data-{{identifier}}-action="nextStep"><span>next</span></button>`)
    const button = f1.element.firstElementChild as HTMLButtonElement
    const buttonChild = button.firstElementChild as HTMLSpanElement

    const actual = { eventCount: 0, eventType: null, eventPrevented: false, eventTarget: null, target: null }
    const expected = { eventCount: 1, eventType: "click", eventPrevented: true, eventTarget: buttonChild, target: button }

    this.application.register(f1.identifier, class extends Controller {
      nextStep(event, target) {
        actual.eventCount++
        actual.eventType = event.type
        actual.eventPrevented = event.defaultPrevented
        actual.eventTarget = event.target
        actual.target = target
      }
    })

    await setFixture(f1.element)
    triggerEvent(buttonChild, "click")
    assert.deepEqual(actual, expected)
    done()
  })
})
