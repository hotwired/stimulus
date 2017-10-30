import {
  Application,
  ConfigurationOptions, createConfiguration,
  Controller, ControllerConstructor
} from "@stimulus/core"
import { ElementQuery, ElementQueryDescriptor } from "./element_query"
import { createEvent } from "./event"

export type ControllerConstructorMap = { [identifier: string]: ControllerConstructor }

export class TestEnvironment {
  application: Application

  static setup(configurationOptions: ConfigurationOptions, controllerConstructors: ControllerConstructorMap): TestEnvironment {
    const application = new Application(configurationOptions)
    const testEnvironment = new this(application)
    testEnvironment.register(controllerConstructors)
    testEnvironment.setup()
    return testEnvironment
  }

  constructor(application: Application) {
    this.application = application
  }

  get controllers(): Controller[] {
    return this.application.controllers
  }

  get rootElement(): Element {
    return this.configuration.rootElement
  }

  setup() {
    this.application.start()
  }

  teardown() {
    this.application.stop()
  }

  register(controllerConstructors: ControllerConstructorMap) {
    for (const identifier in controllerConstructors) {
      const controllerConstructor = controllerConstructors[identifier]
      this.application.register(identifier, controllerConstructor)
    }
  }

  async loadFixture(fixture: string | Node): Promise<any> {
    if (typeof fixture == "string") {
      this.rootElement.innerHTML = fixture
    } else {
      this.rootElement.innerHTML = ""
      this.rootElement.appendChild(fixture)
    }

    return this.nextFrame()
  }

  async triggerEvent(event: string | Event, descriptor: ElementQueryDescriptor): Promise<Event> {
    if (typeof event == "string") {
      return this.triggerEvent(createEvent(event), descriptor)
    }

    const element = this.findElement(descriptor)
    if (element) {
      element.dispatchEvent(event)
      return Promise.resolve(event)
    } else {
      return Promise.reject("couldn't find element")
    }
  }

  async nextFrame(): Promise<any> {
    return new Promise(resolve => requestAnimationFrame(resolve))
  }

  findController(identifier: string): Controller | undefined {
    return this.controllers.find(controller => controller.identifier == identifier)
  }

  findAllControllers(identifier: string): Controller[] {
    return this.controllers.filter(controller => controller.identifier == identifier)
  }

  findElement(descriptor: ElementQueryDescriptor, rootElement: Element = this.rootElement) {
    return new ElementQuery(createConfiguration(this.configuration, rootElement), descriptor).firstElement
  }

  findAllElements(descriptor: ElementQueryDescriptor, rootElement: Element = this.rootElement) {
    return new ElementQuery(createConfiguration(this.configuration, rootElement), descriptor).allElements
  }

  private get configuration() {
    return this.application.configuration
  }
}
