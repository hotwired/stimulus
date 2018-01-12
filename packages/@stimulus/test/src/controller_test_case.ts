import { ApplicationTestCase } from "./application_test_case"
import { Controller, ControllerConstructor } from "stimulus"

export class ControllerTestCase<T> extends ApplicationTestCase {
  identifier: string = "test"
  controllerConstructor: ControllerConstructor

  setupApplication() {
    this.application.register(this.identifier, this.controllerConstructor)
  }

  get controller(): T {
    const controller = this.application.controllers[0]
    if (controller) {
      return controller as any as T
    } else {
      throw new Error("no controller connected")
    }
  }
}
