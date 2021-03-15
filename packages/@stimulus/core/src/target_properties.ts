import { BasicController } from "./basic_controller"
import { blessed } from "./blessing"
import { readInheritableStaticArrayValues } from "./inheritable_statics"
import { Mixin } from "./mixin"
import { capitalize } from "./string_helpers"

const Targets = Mixin
  .forConstructor(BasicController)
  .define(base =>
    class Targets extends base {
      get targets() {
        return this.scope.targets
      }
    }
  )

export const BlessedTargetProperties = Targets
  .define(base =>
    blessed(
      class BlessedTargets extends base {
        static targets: string[]
      },

      base => {
        const targets = readInheritableStaticArrayValues(base, "targets")
        return targets.reduce((extended, name) => {
          return mixinForTarget(name).extends(extended)
        }, base)
      }
    )
  )

function mixinForTarget<K extends string>(key: K) {
  const name = `${key}Target` as const

  return Mixin
    .forMixin(Targets)
    .defineGetter(name, function() {
      const target = this.targets.find(key)
      if (target) {
        return target
      } else {
        throw new Error(`Missing target element "${name}" for "${this.identifier}" controller`)
      }
    })
    .defineGetter(`${name}s` as const, function() {
      return this.targets.findAll(key)
    })
    .defineGetter(`has${capitalize(name)}` as const, function() {
      return this.targets.has(key)
    })
}
