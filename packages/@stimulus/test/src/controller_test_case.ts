import { ApplicationTestCase } from "./application_test_case"
import { ControllerConstructor } from "@stimulus/core"

export class ControllerTestCase<T> extends ApplicationTestCase {
  identifier: string = "test"
  controllerConstructor: ControllerConstructor
  fixtureHTML = `<div data-controller="${this.identifier}">`

  setupApplication() {
    this.application.register(this.identifier, this.controllerConstructor)
  }

  get controller(): T {
    const controller = this.controllers[0]
    if (controller) {
      return controller
    } else {
      throw new Error("no controller connected")
    }
  }

  get controllers(): T[] {
    return this.application.controllers as any as T[]
  }
}
