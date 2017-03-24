import { Application, Controller } from "stimulus"
import { setFixture } from "./test_helpers"

QUnit.module("Controller callbacks", function(hooks) {
  hooks.beforeEach(function() {
    this.application = Application.start()
  })

  hooks.afterEach(function () {
    this.application.stop()
  })

  QUnit.test("intialize, connect, disconnect", function (assert) {
    const done = assert.async()
    const counts = { initialize: 0, connect: 0, disconnect: 0 }

    const identifier = "test"
    const element = document.createElement("div")
    element.setAttribute("data-controller", identifier)

    this.application.register(identifier, class extends Controller {
      initialize() { counts.initialize++ }
      connect()    { counts.connect++    }
      disconnect() { counts.disconnect++ }
    })

    setFixture(element, function () {
      assert.deepEqual(counts, { initialize: 1, connect: 1, disconnect: 0 })

      setFixture("", function () {
        assert.deepEqual(counts, { initialize: 1, connect: 1, disconnect: 1 })

        setFixture(element, function () {
          assert.deepEqual(counts, { initialize: 1, connect: 2, disconnect: 1 })
          done()
        })
      })
    })
  })
})
