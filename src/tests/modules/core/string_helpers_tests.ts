import { TestCase } from "../../cases/test_case"
import * as helpers from "../../../core/string_helpers"

export default class StringHelpersTests extends TestCase {
  "test should camelize strings"() {
    this.assert.equal(helpers.camelize("underscore_value"), "underscoreValue")
    this.assert.equal(helpers.camelize("Underscore_value"), "UnderscoreValue")
    this.assert.equal(helpers.camelize("underscore_Value"), "underscore_Value")
    this.assert.equal(helpers.camelize("Underscore_Value"), "Underscore_Value")
    this.assert.equal(helpers.camelize("multi_underscore_value"), "multiUnderscoreValue")

    this.assert.equal(helpers.camelize("dash-value"), "dashValue")
    this.assert.equal(helpers.camelize("Dash-value"), "DashValue")
    this.assert.equal(helpers.camelize("dash-Value"), "dash-Value")
    this.assert.equal(helpers.camelize("Dash-Value"), "Dash-Value")
    this.assert.equal(helpers.camelize("multi-dash-value"), "multiDashValue")
  }

  "test should namespace camelize strings"() {
    this.assert.equal(helpers.namespaceCamelize("underscore__value"), "underscoreValue")
    this.assert.equal(helpers.namespaceCamelize("Underscore__value"), "UnderscoreValue")
    this.assert.equal(helpers.namespaceCamelize("underscore__Value"), "underscore_Value")
    this.assert.equal(helpers.namespaceCamelize("Underscore__Value"), "Underscore_Value")
    this.assert.equal(helpers.namespaceCamelize("multi__underscore__value"), "multiUnderscoreValue")

    this.assert.equal(helpers.namespaceCamelize("dash--value"), "dashValue")
    this.assert.equal(helpers.namespaceCamelize("Dash--value"), "DashValue")
    this.assert.equal(helpers.namespaceCamelize("dash--Value"), "dash-Value")
    this.assert.equal(helpers.namespaceCamelize("Dash--Value"), "Dash-Value")
    this.assert.equal(helpers.namespaceCamelize("multi--dash--value"), "multiDashValue")
  }

  "test should dasherize strings"() {
    this.assert.equal(helpers.dasherize("camelizedValue"), "camelized-value")
    this.assert.equal(helpers.dasherize("longCamelizedValue"), "long-camelized-value")
  }

  "test should capitalize strings"() {
    this.assert.equal(helpers.capitalize("lowercase"), "Lowercase")
    this.assert.equal(helpers.capitalize("Uppercase"), "Uppercase")
  }

  "test should tokenize strings"() {
    this.assert.deepEqual(helpers.tokenize(""), [])
    this.assert.deepEqual(helpers.tokenize("one"), ["one"])
    this.assert.deepEqual(helpers.tokenize("two words"), ["two", "words"])
    this.assert.deepEqual(helpers.tokenize("a_lot of-words with special--chars mixed__in"), [
      "a_lot",
      "of-words",
      "with",
      "special--chars",
      "mixed__in",
    ])
  }
}
