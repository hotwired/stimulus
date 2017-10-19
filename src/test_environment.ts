import { Application } from "./application"
import { ControllerConstructor } from "./controller"
import { ElementQueryDescriptor } from "./element_query"

export class TestEnvironment {
  application: Application

  constructor(application: Application) {
    this.application = application
  }

  setup() {
    this.application.start()
  }

  teardown() {
    this.application.stop()
  }

  register(controllerConstructors: { [identifier: string]: ControllerConstructor }) {
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

  }

  findAllElements(descriptor: ElementQueryDescriptor, rootElement: Element = this.rootElement) {

  }

  private get rootElement() {
    return this.configuration.rootElement
  }

  private get configuration() {
    return this.application.configuration
  }
}
