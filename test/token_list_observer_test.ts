import { test, testGroup, nextFrame } from "./lib/helpers"
import { TestEnvironment } from "./lib/environment"
import { TokenListObserverRecorder } from "./lib/delegate_recorders"
import { TokenListObserver } from "sentinella"

testGroup("TokenListObserver", hooks => {
  hooks.beforeEach(() => { this.env = TestEnvironment.setup(TokenListObserver, TokenListObserverRecorder) })
  hooks.afterEach(()  => { this.env.teardown() })

  test("token matches", async assert => {
    const done = assert.async()
    const { element, childElement, attributeName, recorder } = this.env

    element.setAttribute(attributeName, "a")
    childElement.setAttribute(attributeName, "a")
    await nextFrame()

    element.setAttribute(attributeName, "a b")
    childElement.setAttribute(attributeName, "a b")
    await nextFrame()

    assert.deepEqual(recorder.entries, [
      { elementMatchedTokenForAttribute: [element, "a", attributeName] },
      { elementMatchedTokenForAttribute: [childElement, "a", attributeName] },
      { elementMatchedTokenForAttribute: [element, "b", attributeName] },
      { elementMatchedTokenForAttribute: [childElement, "b", attributeName] }
    ])

    done()
  })

  test("token match uniqueness", async assert => {
    const done = assert.async()
    const { element, childElement, attributeName, recorder } = this.env

    element.setAttribute(attributeName, "a")
    childElement.setAttribute(attributeName, "a")
    await nextFrame()

    element.setAttribute(attributeName, "a a")
    childElement.setAttribute(attributeName, "a a")
    await nextFrame()

    assert.deepEqual(recorder.entries, [
      { elementMatchedTokenForAttribute: [element, "a", attributeName] },
      { elementMatchedTokenForAttribute: [childElement, "a", attributeName] }
    ])

    done()
  })

  test("token unmatches", async assert => {
    const done = assert.async()
    const { element, childElement, attributeName, recorder } = this.env

    element.setAttribute(attributeName, "a b")
    childElement.setAttribute(attributeName, "a b")
    await nextFrame()

    element.setAttribute(attributeName, "a")
    childElement.setAttribute(attributeName, "a")
    await nextFrame()

    assert.deepEqual(recorder.entries.slice(-2), [
      { elementUnmatchedTokenForAttribute: [element, "b", attributeName] },
      { elementUnmatchedTokenForAttribute: [childElement, "b", attributeName] },
    ])

    done()
  })
})
