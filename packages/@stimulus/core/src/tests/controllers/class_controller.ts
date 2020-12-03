import { Controller } from "../../controller"

class BaseClassController extends Controller {
  static classes = [ "active" ]

  readonly activeClass!: string
  readonly hasActiveClass!: boolean
}

export class ClassController extends BaseClassController {
  static classes = [ "enabled", "loading" ]

  readonly hasEnabledClass!: boolean
  readonly enabledClass!: string
  readonly loadingClass!: string
}
