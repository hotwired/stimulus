import { Application } from "./application"
import { ConfigurationOptions } from "./configuration"
import { ControllerConstructor } from "./controller"
import { ElementQuery, ElementQueryDescriptor } from "./element_query"

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

  async loadFixture(fixture: string | Node) {
    if (typeof fixture == "string") {
      this.rootElement.innerHTML = fixture
    } else {
      this.rootElement.innerHTML = ""
      this.rootElement.appendChild(fixture)
    }

    return Promise.resolve(ok => requestAnimationFrame(ok))
  }

  async triggerEvent(eventName: string, descriptor: ElementQueryDescriptor) {

  }

  findController(identifier: string) {

  }

  findAllControllers(identifier: string) {

  }

  findElement(descriptor: ElementQueryDescriptor, rootElement: Element = this.rootElement) {
    return new ElementQuery(rootElement, this.configuration, descriptor).firstElement
  }

  findAllElements(descriptor: ElementQueryDescriptor, rootElement: Element = this.rootElement) {
    return new ElementQuery(rootElement, this.configuration, descriptor).allElements
  }

  private get rootElement() {
    return this.configuration.rootElement
  }

  private get configuration() {
    return this.application.configuration
  }
}
