import { Constructor } from "./constructor"
import { Controller } from "./controller"
import { readInheritableStaticArrayValues } from "./inheritable_statics"
import { capitalize, namespaceCamelize } from "./string_helpers"

export function OutletPropertiesBlessing<T>(constructor: Constructor<T>) {
  const outlets = readInheritableStaticArrayValues(constructor, "outlets")
  return outlets.reduce((properties: any, outletDefinition: any) => {
    return Object.assign(properties, propertiesForOutletDefinition(outletDefinition))
  }, {} as PropertyDescriptorMap)
}

function propertiesForOutletDefinition(name: string) {
  const camelizedName = namespaceCamelize(name)

  return {
    [`${camelizedName}Outlet`]: {
      get(this: Controller) {
        const outlet = this.outlets.find(name)

        if (outlet) {
          const outletController = this.application.getControllerForElementAndIdentifier(outlet, name)
          if (outletController) {
            return outletController
          } else {
            throw new Error(`Missing "data-controller=${name}" attribute on outlet element for "${this.identifier}" controller`)
          }
        }

        throw new Error(`Missing outlet element "${name}" for "${this.identifier}" controller`)
      }
    },

    [`${camelizedName}Outlets`]: {
      get(this: Controller) {
        const outlets = this.outlets.findAll(name)

        if (outlets.length > 0) {
          return outlets.map((outlet: Element) => {
            const controller = this.application.getControllerForElementAndIdentifier(outlet, name)
            if (controller) {
              return controller
            } else {
              console.warn(`The provided outlet element is missing the outlet controller "${name}" for "${this.identifier}"`, outlet)
            }
          }).filter(controller => controller) as Controller[]
        }

        return []
      }
    },

    [`${camelizedName}OutletElement`]: {
      get(this: Controller) {
        const outlet = this.outlets.find(name)
        if (outlet) {
          return outlet
        } else {
          throw new Error(`Missing outlet element "${name}" for "${this.identifier}" controller`)
        }
      }
    },

    [`${camelizedName}OutletElements`]: {
      get(this: Controller) {
        return this.outlets.findAll(name)
      }
    },

    [`has${capitalize(camelizedName)}Outlet`]: {
      get(this: Controller) {
        return this.outlets.has(name)
      }
    }
  }
}
