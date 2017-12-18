import { Controller } from "stimulus"
import { testGroup, test, setFixture } from "./test_helpers"

testGroup("Controller targets", function () {
  test("find", function (assert) {
    const done = assert.async()

    const identifier = "test"
    const element = document.createElement("div")
    element.setAttribute("data-controller", identifier)

    const targetElement = document.createElement("span")
    targetElement.setAttribute("data-target", `${identifier}.foo`)
    element.appendChild(targetElement)

    this.application.register(identifier, class extends Controller {
      connect() {
        assert.equal(this.targets.find("foo"), targetElement)
        done()
      }
    })

    setFixture(element)
  })

  test("findAll", function (assert) {
    const done = assert.async()

    const identifier = "test"
    const element = document.createElement("div")
    element.setAttribute("data-controller", identifier)

    const targetElement1 = document.createElement("span")
    targetElement1.setAttribute("data-target", `${identifier}.foo`)
    element.appendChild(targetElement1)

    const targetElement2 = targetElement1.cloneNode(true)
    element.appendChild(targetElement2)

    const targetElement3 = document.createElement("span")
    targetElement3.setAttribute("data-target", `${identifier}.bar`)
    element.appendChild(targetElement3)

    const targetElement4 = document.createElement("span")
    targetElement4.setAttribute("data-target", "x.bar")
    element.appendChild(targetElement4)

    this.application.register(identifier, class extends Controller {
      connect() {
        assert.deepEqual(this.targets.findAll("foo", "bar"), [targetElement1, targetElement2, targetElement3])
        done()
      }
    })

    setFixture(element)
  })

  test("has", function (assert) {
    const done = assert.async()

    const identifier = "test"
    const element = document.createElement("div")
    element.setAttribute("data-controller", identifier)

    const targetElement = document.createElement("span")
    targetElement.setAttribute("data-target", `${identifier}.foo`)
    element.appendChild(targetElement)

    this.application.register(identifier, class extends Controller {
      connect() {
        assert.equal(this.targets.has("foo"), true)
        assert.equal(this.targets.has("bar"), false)
        done()
      }
    })

    setFixture(element)
  })

  test("excludes child controller targets", function (assert) {
    const done = assert.async()

    const identifier = "test"
    const element = document.createElement("div")
    element.setAttribute("data-controller", identifier)

    const targetElement = document.createElement("span")
    targetElement.setAttribute("data-target", `${identifier}.foo`)
    element.appendChild(targetElement)

    const childElement = element.cloneNode(true)
    element.appendChild(childElement)

    let testCount = 0
    this.application.register(identifier, class extends Controller {
      connect() {
        assert.equal(this.targets.findAll("foo").length, 1, `${this.element.outerHTML} should only have one "foo" target`)
        if (++testCount == 2) {
          done()
        }
      }
    })

    setFixture(element)
  })
})
