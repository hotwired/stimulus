import { Controller } from "@stimulus/core"
import { ControllerTestCase } from "@stimulus/test"

export class BareControllerTestCase extends ControllerTestCase<Controller> {
  controllerConstructor = Controller
}
