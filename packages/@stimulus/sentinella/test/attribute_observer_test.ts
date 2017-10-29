import { test, testGroup, nextFrame } from "./lib/helpers"
import { TestEnvironment } from "./lib/environment"
import { AttributeObserverRecorder } from "./lib/delegate_recorders"
import { AttributeObserver } from "@stimulus/sentinella"

testGroup("AttributeObserver", hooks => {
  hooks.beforeEach(() => { this.env = TestEnvironment.setup(AttributeObserver, AttributeObserverRecorder) })
  hooks.afterEach(()  => { this.env.teardown() })

  test("attribute matches", async assert => {
    const done = assert.async()
    const { element, childElement, attributeName, recorder } = this.env

    element.setAttribute(attributeName, "a")
    childElement.setAttribute(attributeName, "a")
    await nextFrame()

    assert.deepEqual(recorder.entries, [
      { elementMatchedAttribute: [element, attributeName] },
      { elementMatchedAttribute: [childElement, attributeName] }
    ])

    done()
  })

  test("attribute value changes", async assert => {
    const done = assert.async()
    const { element, childElement, attributeName, recorder } = this.env

    element.setAttribute(attributeName, "a")
    childElement.setAttribute(attributeName, "a")
    await nextFrame()

    element.setAttribute(attributeName, "b")
    childElement.setAttribute(attributeName, "b")
    await nextFrame()

    assert.deepEqual(recorder.entries.slice(-2), [
      { elementAttributeValueChanged: [element, attributeName] },
      { elementAttributeValueChanged: [childElement, attributeName] }
    ])

    done()
  })

  test("attribute unmatches", async assert => {
    const done = assert.async()
    const { element, childElement, attributeName, recorder } = this.env

    element.setAttribute(attributeName, "a")
    childElement.setAttribute(attributeName, "a")
    await nextFrame()

    element.removeAttribute(attributeName)
    childElement.removeAttribute(attributeName)
    await nextFrame()

    assert.deepEqual(recorder.entries.slice(-2), [
      { elementUnmatchedAttribute: [element, attributeName] },
      { elementUnmatchedAttribute: [childElement, attributeName] }
    ])

    done()
  })
})
