import { Request, Response } from "@stimulus/http"
import { Resource } from "./resource"

export interface OperationDelegate {
  readonly resource: Resource
  shouldPerformOperation(operation: Operation): boolean
  operationStarted(operation: Operation): void
  operationEnded(operation: Operation): void
  operationSucceededWithResponse(operation: Operation, response: Response): void
  operationFailedWithError(operation: Operation, error: Error): void
}

enum OperationState {
  initialized,
  started,
  accepted,
  succeeded,
  canceled,
  failed
}

export class Operation {
  readonly delegate: OperationDelegate
  readonly name: string
  readonly request: Request
  private state = OperationState.initialized

  constructor(delegate: OperationDelegate, name: string, request: Request) {
    this.delegate = delegate
    this.name = name
    this.request = request
  }

  start() {
    if (this.state == OperationState.initialized) {
      this.state = OperationState.started
      if (this.delegate.shouldPerformOperation(this)) {
        this.accept()
      } else {
        this.cancel()
      }
    }
  }

  cancel() {
    if (this.state == OperationState.started) {
      this.state = OperationState.canceled
      this.delegate.operationEnded(this)
    }
  }

  accept() {
    if (this.state == OperationState.started) {
      this.state = OperationState.accepted
      this.delegate.operationStarted(this)
      this.perform()
    }
  }

  receive(response: Response) {
    if (this.state == OperationState.accepted) {
      this.state = OperationState.succeeded
      this.delegate.operationEnded(this)
      this.delegate.operationSucceededWithResponse(this, response)
    }
  }

  handleError(error: Error) {
    if (this.state == OperationState.accepted) {
      this.state = OperationState.failed
      this.delegate.operationEnded(this)
      this.delegate.operationFailedWithError(this, error)
    }
  }

  private async perform() {
    try {
      const response = await this.request.perform()
      if (response.ok) {
        this.receive(response)
      } else {
        throw new Error(`HTTP ${response.statusCode}`)
      }
    } catch (error) {
      this.handleError(error)
    }
  }
}
