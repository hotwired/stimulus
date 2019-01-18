import { Controller } from ".."
import { ControllerTestCase } from "./controller_test_case"

export class BareControllerTestCase extends ControllerTestCase<Controller> {
  controllerConstructor = Controller
}
