import { LogControllerTestCase } from "../cases/log_controller_test_case"

export default class MutationTests extends LogControllerTestCase {
  identifier = "c"
  fixtureHTML = `
    <div data-controller="c" data-mutation="contenteditable->c#logMutation">
      <button data-mutation="c#logMutation"><span>Log</span></button>
      <section data-mutation="id->c#logMutation"><p>Log</p></section>
      <div id="outer" data-mutation="contenteditable->c#logMutation">
        <div id="inner" data-controller="c" data-mutation="contenteditable->c#logMutation class->c#logMutation"></div>
      </div>
      <div id="with-options" data-controller="c" data-mutation="contenteditable->c#logMutation:!subtree">
        <div>With Options Child</div>
      </div>
      <div id="multiple" data-mutation="class->c#logMutation class->c#logMutation2"></div>
    </div>
    <div id="outside"></div>
    <svg id="svgRoot" data-controller="c" data-mutation="fill->c#logMutation">
      <circle id="svgChild" data-mutation="stroke->c#logMutation" cx="5" cy="5" r="5">
    </svg>
  `

  async "test default mutation"() {
    await this.setAttribute("button", "id", "button")
    this.assertMutations({ type: "attribute", attributeName: "id", oldValue: null })

    await this.removeAttribute("button", "id")
    this.assertMutations({ type: "attribute", attributeName: "id", oldValue: "button" })
  }

  async "test bubbling mutations"() {
    await this.setAttribute("span", "id", "span")
    this.assertMutations({ type: "attribute", attributeName: "id", oldValue: null })

    await this.removeAttribute("span", "id")
    this.assertMutations({ type: "attribute", attributeName: "id", oldValue: "button" })
  }

  async "test non-bubbling mutations"() {
    await this.setAttribute("section p", "role", "presentation")
    this.assertNoActions()

    const section = await this.findElement("section")
    await section.insertAdjacentHTML("beforeend", "<div>Ignored</div>")
    this.assertNoActions()

    const div = await this.findElement("section div")
    await section.removeChild(div)
    this.assertNoActions()
  }

  async "test nested mutations"() {
    const innerController = this.controllers[1]

    await this.setAttribute("#inner", "contenteditable", "")
    this.assertMutations({ controller: innerController, type: "attribute", attributeName: "contenteditable", oldValue: null })

    await this.removeAttribute("#inner", "contenteditable")
    this.assertMutations({ controller: innerController, type: "attribute", attributeName: "contenteditable", oldValue: "" })

    await this.setAttribute("#inner", "class", "mutated")
    this.assertMutations({ controller: innerController, type: "attribute", attributeName: "class", oldValue: null })
  }

  async "test with options"() {
    await this.setAttribute("#with-options div", "contenteditable", "")
    this.assertNoMutations()

    await this.setAttribute("#with-options", "contenteditable", "")
    this.assertMutations({ type: "attribute", attributeName: "class", oldValue: null })
  }

  async "test multiple mutations"() {
    await this.setAttribute("#multiple", "class", "mutated")
    this.assertMutations(
      { name: "logMutation", attributeName: "class", oldValue: null },
      { name: "logMutation2", attributeName: "class", oldValue: null },
    )

    await this.removeAttribute("#multiple", "class")
    this.assertMutations(
      { name: "logMutation", attributeName: "class", oldValue: "mutated" },
      { name: "logMutation2", attributeName: "class", oldValue: "mutated" },
    )
  }

  async "test mutations on svg elements"() {
    await this.setAttribute("#svgRoot", "fill", "#fff")
    await this.setAttribute("#svgChild", "stroke", "#000")
    this.assertActions(
      { name: "mutationLog", attributeName: "fill" },
      { name: "mutationLog", attributeName: "stroke" }
    )
  }
}
