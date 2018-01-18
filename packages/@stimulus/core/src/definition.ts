import { ControllerConstructor } from "./controller"

export interface Definition {
  identifier: string
  controllerConstructor: ControllerConstructor
}

export function importDefinition(definition: Definition): Definition {
  const importer = new DefinitionImporter(definition)
  return importer.definition
}

class DefinitionImporter {
  identifier: string
  controllerConstructor: ControllerConstructor

  constructor({ identifier, controllerConstructor }: Definition) {
    this.identifier = identifier
    this.controllerConstructor = class extends controllerConstructor {}
    this.defineTargetProperties()
  }

  get definition(): Definition {
    const { identifier, controllerConstructor } = this
    return { identifier, controllerConstructor }
  }

  private defineTargetProperties() {
    this.targetNames.forEach(targetName => {
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

