import { Controller } from "@stimulus/core"
import { Request, Response } from "@stimulus/http"
import { createEvent } from "./event_helpers"
import { Operation, OperationDelegate } from "./operation"
import { Resource } from "./resource"

export class ResourceController extends Controller implements OperationDelegate {
  initialize() {
    if (this.data.has("autoload")) {
      this.issue("show", this.resource.showRequest)
    }
  }

  create(event: Event) {
    event.preventDefault()
    this.issue("create", this.resource.createRequest)
  }

  edit(event: Event) {
    event.preventDefault()
    this.issue("edit", this.resource.editRequest)
  }

  show(event: Event) {
    event.preventDefault()
    this.issue("show", this.resource.showRequest)
  }

  update(event: Event) {
    event.preventDefault()
    this.issue("update", this.resource.updateRequest)
  }

  destroy(event: Event) {
    event.preventDefault()
    this.issue("destroy", this.resource.destroyRequest)
  }

  issue(name: string, request: Request) {
    return new Operation(this, name, request).start()
  }

  get resource() {
    return new Resource(this.scope)
  }

  shouldPerformOperation(operation: Operation) {
    const event = this.dispatchEventForOperation(operation, `before-${operation.name}`)
    return !event.defaultPrevented
  }

  operationStarted(operation: Operation) {
    this.showActivityIndicator()
  }

  operationEnded(operation: Operation) {
    this.hideActivityIndicator()
  }

  operationSucceededWithResponse(operation: Operation, response: Response) {
    const event = this.dispatchEventForOperation(operation, operation.name)
    if (!event.defaultPrevented) {
      this.present(response)
    }
  }

  operationFailedWithError(operation: Operation, error: Error) {
    alert(error)
  }

  showActivityIndicator() {
    this.element.classList.add(this.activityClass)
  }

  hideActivityIndicator() {
    this.element.classList.remove(this.activityClass)
  }

  async present(response: Response) {
    console.log("presenting", response)
    this.element.outerHTML = await response.html
  }

  dispatchEventForOperation(operation: Operation, name: string) {
    const event = createEvent(`resource:${name}`, operation)
    console.log("dispatching", event.type, event)
    this.element.dispatchEvent(event)
    return event
  }

  get activityClass() {
    return this.data.get("activityClass") || "busy"
  }
}
