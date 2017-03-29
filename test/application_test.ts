import { testGroup, test, createControllerFixture, getFixture, nextFrame } from "./test_helpers"
import { Application } from "stimulus"

testGroup("Application", function() {
  test("Application.start()", function(assert) {
    const app = Application.start()
    assert.ok(app instanceof Application)
  })

  test("only connects controllers while started", async function(assert) {
    const done = assert.async()
    const fixtureElement = getFixture()

    const f1 = createControllerFixture()
    this.application.register(f1.identifier, f1.constructor)

    const f2 = createControllerFixture()
    this.application.register(f2.identifier, f2.constructor)

    fixtureElement.appendChild(f1.element)
    await nextFrame()
    assert.deepEqual(f1.counts, { initialize: 1, connect: 1, disconnect: 0 })
    assert.deepEqual(f2.counts, { initialize: 0, connect: 0, disconnect: 0 })

    this.application.stop()
    fixtureElement.appendChild(f2.element)
    await nextFrame()

    assert.deepEqual(f1.counts, { initialize: 1, connect: 1, disconnect: 0 })
    assert.deepEqual(f2.counts, { initialize: 0, connect: 0, disconnect: 0 })

    this.application.start()
    await nextFrame()

    assert.deepEqual(f1.counts, { initialize: 1, connect: 1, disconnect: 0 })
    assert.deepEqual(f2.counts, { initialize: 1, connect: 1, disconnect: 0 })

    done()
  })
})

