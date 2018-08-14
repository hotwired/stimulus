import { ApplicationTestCase } from "./application_test_case"
import { ControllerConstructor } from "../src/controller"

export class ControllerTestCase<T> extends ApplicationTestCase {
  identifier: string | string[] = "test"
  controllerConstructor!: ControllerConstructor
  fixtureHTML = `<div data-controller="${this.identifiers.join(" ")}">`

  setupApplication() {
    this.identifiers.forEach(identifier => {
      this.application.register(identifier, this.controllerConstructor)
    })
  }

  get controller(): T {
    const controller = this.controllers[0]
    if (controller) {
      return controller
    } else {
      throw new Error("no controller connected")
    }
  }

  get identifiers(): string[] {
    if (typeof this.identifier == "string") {
      return [this.identifier]
    } else {
      return this.identifier
    }
  }

  get controllers(): T[] {
    return this.application.controllers as any as T[]
  }
}
