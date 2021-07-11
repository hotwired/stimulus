import { TestCase } from "@stimulus/test"
import { identifierForContextKey } from ".."

(class WebpackHelperTests extends TestCase {
  "test filenames require an extension"() {
    this.assertContextKeyMapsToIdentifier("./hello_controller", undefined)
    this.assertContextKeyMapsToIdentifier("./hello_controller.js", "hello")
    this.assertContextKeyMapsToIdentifier("./hello_controller.ts", "hello")
  }

  "test filenames require a controller suffix"() {
    this.assertContextKeyMapsToIdentifier("./hello.js", undefined)
    this.assertContextKeyMapsToIdentifier("./hello_world.js", undefined)
    this.assertContextKeyMapsToIdentifier("./hello_controller.js", "hello")
    this.assertContextKeyMapsToIdentifier("./hello-controller.js", "hello")
  }

  "test underscores map to one dash"() {
    this.assertContextKeyMapsToIdentifier("./remote_content_controller.js", "remote-content")
    this.assertContextKeyMapsToIdentifier("./date_range_editor_controller.js", "date-range-editor")
  }

  "test slashes map to two dashes"() {
    this.assertContextKeyMapsToIdentifier("./users/list_item_controller.js", "users--list-item")
    this.assertContextKeyMapsToIdentifier("./my/navigation/menu_controller.js", "my--navigation--menu")
  }

  assertContextKeyMapsToIdentifier(contextKey: string, expectedIdentifier?: string) {
    const actualIdentifier = identifierForContextKey(contextKey)
    this.assert.equal(actualIdentifier, expectedIdentifier)
  }
}).defineModule()
