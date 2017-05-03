import { Controller } from "stimulus"
import { testGroup, test, setFixture, createControllerFixture } from "./test_helpers"

testGroup("Controller data API", function () {
  test("get", function (assert) {
    const done = assert.async()

    const { identifier, element } = createControllerFixture()
    element.setAttribute(`data-${identifier}-foo`, "bar")

    this.application.register(identifier, class extends Controller {
      connect() {
        assert.equal(this.data.get("foo"), "bar")
        done()
      }
    })

    setFixture(element)
  })

  test("set", function (assert) {
    const done = assert.async()

    const { identifier, element } = createControllerFixture()

    this.application.register(identifier, class extends Controller {
      connect() {
        this.data.set("foo", "bar")
        assert.equal(this.data.get("foo"), "bar")
        assert.equal(element.getAttribute(`data-${identifier}-foo`), "bar")
        done()
      }
    })

    setFixture(element)
  })

  test("has", function (assert) {
    const done = assert.async()

    const { identifier, element } = createControllerFixture()
    element.setAttribute(`data-${identifier}-foo`, "")

    this.application.register(identifier, class extends Controller {
      connect() {
        assert.equal(this.data.has("foo"), true)
        assert.equal(this.data.has("bar"), false)
        done()
      }
    })

    setFixture(element)
  })

  test("delete", function (assert) {
    const done = assert.async()

    const { identifier, element } = createControllerFixture()
    element.setAttribute(`data-${identifier}-foo`, "")

    this.application.register(identifier, class extends Controller {
      connect() {
        assert.equal(this.data.delete("bar"), false)
        assert.equal(this.data.delete("foo"), true)
        assert.equal(element.hasAttribute(`data-${identifier}-foo`), false)
        done()
      }
    })

    setFixture(element)
  })
})
