import { Application } from "./application"
import { Context } from "./context"
import { ControllerConstructor } from "./controller"
import { Definition } from "./definition"

export class Module {
  readonly application: Application
  readonly definition: Definition

  private contextsByElement: WeakMap<Element, Context>
  private connectedContexts: Set<Context>

  constructor(application: Application, definition: Definition) {
    this.application = application
    this.definition = Object.assign({}, definition)
    this.contextsByElement = new WeakMap
    this.connectedContexts = new Set
    this.defineTargetProperties()
  }

  get identifier(): string {
    return this.definition.identifier
  }

  get controllerConstructor(): ControllerConstructor {
    return this.definition.controllerConstructor
  }

  get contexts(): Context[] {
    return Array.from(this.connectedContexts)
  }

  get size(): number {
    return this.connectedContexts.size
  }

  connectElement(element: Element) {
    const context = this.fetchContextForElement(element)
    if (context && !this.connectedContexts.has(context)) {
      this.connectedContexts.add(context)
      context.connect()
    }
  }

  disconnectElement(element: Element) {
    const context = this.fetchContextForElement(element)
    if (context && this.connectedContexts.has(context)) {
      this.connectedContexts.delete(context)
      context.disconnect()
    }
  }

  getContextForElement(element: Element): Context | undefined {
    return this.contextsByElement.get(element)
  }

  private fetchContextForElement(element: Element): Context {
    let context = this.contextsByElement.get(element)
    if (!context) {
      context = new Context(this, element)
      this.contextsByElement.set(element, context)
    }
    return context
  }

  // Target properties

  private defineTargetProperties(targetNames: string[] = this.targetNames) {
    targetNames.forEach(targetName => {
      this.defineProperty(`${targetName}Target`, {
        get() { return this.targets.find(targetName) }
      })
      this.defineProperty(`${targetName}Targets`, {
        get() { return this.targets.findAll(targetName) }
      })
    })
  }

  private defineProperty(name: string, descriptor: PropertyDescriptor) {
    const { prototype } = this.controllerConstructor
    if (name in prototype) return
    Object.defineProperty(prototype, name, descriptor)
  }

  private get targetNames(): string[] {
    const names = new Set
    let { controllerConstructor } = this
    while (controllerConstructor) {
      const { targets } = controllerConstructor
      if (Array.isArray(targets)) {
        targets.forEach(name => names.add(name))
      }
      controllerConstructor = Object.getPrototypeOf(controllerConstructor)
    }
    return Array.from(names)
  }
}
