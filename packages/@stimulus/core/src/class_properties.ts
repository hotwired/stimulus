import { BasicController } from "./basic_controller"
import { blessed } from "./blessing"
import { readInheritableStaticArrayValues } from "./inheritable_statics"
import { Mixin } from "./mixin"
import { capitalize } from "./string_helpers"

const Classes = Mixin
  .forConstructor(BasicController)
  .define(base =>
    class Classes extends base {
      get classes() {
        return this.scope.classes
      }
    }
  )

export const BlessedClassProperties = Classes
  .define(base =>
    blessed(
      class BlessedClasses extends base {
        static classes: string[]
      },

      base => {
        const classes = readInheritableStaticArrayValues(base, "classes")
        return classes.reduce((extended, name) => {
          return mixinForClass(name).extends(extended)
        }, base)
      }
    )
  )

function mixinForClass<K extends string>(key: K) {
  const name = `${key}Class` as const

  return Mixin
    .forMixin(Classes)
    .defineGetter(name, function() {
      const { classes } = this
      if (classes.has(key)) {
        return classes.get(key)
      } else {
        const attribute = classes.getAttributeName(key)
        throw new Error(`Missing attribute "${attribute}"`)
      }
    })
    .defineGetter(`has${capitalize(name)}` as const, function() {
      return this.classes.has(key)
    })
}
