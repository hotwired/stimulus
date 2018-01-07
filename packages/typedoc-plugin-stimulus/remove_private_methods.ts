import { CommentPlugin } from "typedoc/dist/lib/converter/plugins/CommentPlugin"
import { Component, ConverterComponent } from "typedoc/dist/lib/converter/components"
import { Context } from "typedoc/dist/lib/converter/context"
import { Converter } from "typedoc/dist/lib/converter"
import { ProjectReflection } from "typedoc/dist/lib/models/reflections/project"
import { Reflection } from "typedoc/dist/lib/models/reflections/abstract"
import { ReflectionKind } from "typedoc/dist/lib/models/reflections"

@Component({ name: "remove-private-methods" })
export class RemovePrivateMethodsPlugin extends ConverterComponent {
  private markedReflections: Reflection[]

  initialize() {
    this.markedReflections = []
    this.listenTo(this.owner, {
      [Converter.EVENT_CREATE_SIGNATURE]: this.createSignature,
      [Converter.EVENT_RESOLVE_BEGIN]:    this.resolveBegin
    })
  }

  createSignature(context: Context, reflection: Reflection, node?) {
    if (reflection.flags.isPrivate) {
      this.markedReflections.push(reflection)
    }
  }

  resolveBegin(context: Context, reflection: Reflection, node?) {
    this.markedReflections.forEach(reflection => {
      this.removeReflectionFromProject(reflection, context.project)
    })
  }

  private removeReflectionFromProject(reflection: Reflection, project: ProjectReflection) {
    CommentPlugin.removeReflection(project, reflection)
    if (reflection.parent && (reflection.parent.kind & ReflectionKind.FunctionOrMethod)) {
      CommentPlugin.removeReflection(project, reflection.parent)
    }
  }
}
