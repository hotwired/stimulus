import { Controller } from "./controller"
import { Constructor } from "./constructor"
import { Scope } from "./scope"
import { TargetDescriptor } from "./target_properties"
import { readInheritableStaticArrayValues } from "./inheritable_statics"

export class TargetGuide {
  readonly scope: Scope
  readonly controller: Controller
  readonly definedTargets: Array<String>

  constructor(scope: Scope, controller: Controller) {
    this.scope = scope
    this.controller = controller
    this.definedTargets = readInheritableStaticArrayValues(this.controller.constructor as Constructor<Controller>, "targets")

    this.searchForUndefinedTargets()
  }

  get identifier() {
    return this.scope.identifier
  }

  get targets() {
    return this.scope.targets
  }

  get registeredControllers(): Array<String> {
    return this.controller.application.router.modules.map((c) => c.identifier)
  }

  controllerRegistered(controllerName: string): Boolean {
    return this.registeredControllers.includes(controllerName)
  }

  targetDefined(targetName: string): Boolean {
    return this.definedTargets.includes(targetName)
  }

  private getAllTargets(element: Element): Array<TargetDescriptor> {
    const attribute = `data-${this.identifier}-target`
    const selector = `[${attribute}]`

    return Array.from(element.querySelectorAll(selector)).map((element: Element) => {
      const target = element.getAttribute(attribute)
      return {
        identifier: this.identifier,
        target,
        element,
        attribute,
        legacy: false
      }
    })
  }

  private getAllLegacyTargets(element: Element): Array<TargetDescriptor> {
    const attribute = "data-target"
    const selector = `[${attribute}]`

    return Array.from(element.querySelectorAll(selector)).map((element: Element) => {
      const value = element.getAttribute(attribute)
      const parts = value ? value.split(".") : []
      return {
        identifier: parts[0],
        target: parts[1],
        element,
        attribute,
        legacy: true
      }
    })
  }

  private searchForUndefinedTargets() {
    const { element } = this.scope

    const targets: Array<TargetDescriptor> = [
      ...this.getAllTargets(element),
      ...this.getAllLegacyTargets(element)
    ]

    targets.forEach((descriptor) => {
      const { identifier, attribute, target, legacy, element } = descriptor

      if (identifier && target) {
        this.handleWarningForUndefinedTarget(descriptor)
      } else if (identifier && !target) {
        this.controller.context.handleWarning(
          `The "${attribute}" attribute of the Element doesn't include a target. Please specify a target for the "${identifier}" controller.`,
          `connecting target for "${identifier}"`,
          { identifier, target, attribute, element }
        )
      } else if (legacy && !target) {
        this.controller.context.handleWarning(
          `The "${attribute}" attribute of the Element doesn't include a value. Please specify a controller and target value in the right format.`,
          `connecting target`,
          { identifier, target, attribute, element }
        )
      }
    })
  }

  private handleWarningForUndefinedTarget(descriptor: TargetDescriptor) {
    const { identifier, target, element, attribute } = descriptor

    if (identifier === this.identifier) {
      if (!this.targetDefined(target as string)) {
        this.controller.context.handleWarning(
          `Element references undefined target "${target}" for controller "${identifier}". Make sure you defined the target "${target}" in the "static targets" array of your controller.`,
          `connecting target "${identifier}.${target}"`,
          { identifier, target, element, attribute }
        )
      }
    } else {
      if (!this.controllerRegistered(identifier as string)) {
        this.controller.context.handleWarning(
          `Target "${target}" references undefined controller "${identifier}". Make sure you registered the "${identifier}" controller.`,
          `connecting target "${identifier}.${target}"`,
          { identifier, target, element, attribute }
        )
      }
    }
  }
}
