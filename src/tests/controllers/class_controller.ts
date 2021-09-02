import { Controller } from "../../core/controller";

class BaseClassController extends Controller {
  static classes = [ "active" ]

  readonly activeClass!: string
  readonly activeClasses!: string[]
  readonly hasActiveClass!: boolean
}

export class ClassController extends BaseClassController {
  static classes = [ "enabled", "loading", "success" ]

  readonly hasEnabledClass!: boolean
  readonly enabledClass!: string
  readonly enabledClasses!: string[]
  readonly loadingClass!: string
  readonly successClass!: string
  readonly successClasses!: string[]
}
