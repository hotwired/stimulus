import { Binding } from "./binding"

export class EventListener implements EventListenerObject {
  readonly eventTarget: EventTarget
  readonly eventName: string
  readonly eventOptions: AddEventListenerOptions
  private unorderedBindings: Set<Binding>

  constructor(eventTarget: EventTarget, eventName: string, eventOptions: AddEventListenerOptions) {
    this.eventTarget = eventTarget
    this.eventName = eventName
    this.eventOptions = eventOptions
    this.unorderedBindings = new Set()
  }

  connect() {
    this.eventTarget.addEventListener(this.eventName, this, this.eventOptions)
  }

  disconnect() {
    this.eventTarget.removeEventListener(this.eventName, this, this.eventOptions)
  }

  // Binding observer delegate

  /** @hidden */
  bindingConnected(binding: Binding) {
    this.unorderedBindings.add(binding)
  }

  /** @hidden */
  bindingDisconnected(binding: Binding) {
    this.unorderedBindings.delete(binding)
  }

  handleEvent(event: Event) {
    const extendedEvent = extendEvent(event)
    for (const binding of this.bindings) {
      if (extendedEvent.immediatePropagationStopped) {
        break
      } else {
        binding.handleEvent(extendedEvent)
      }
    }
  }

  get bindings(): Binding[] {
    return Array.from(this.unorderedBindings).sort((left, right) => {
      const leftIndex = left.index, rightIndex = right.index
      return leftIndex < rightIndex ? -1 : leftIndex > rightIndex ? 1 : 0
    })
  }

}

function extendEvent(event: Event) {
  if ("immediatePropagationStopped" in event) {
    return event
  } else {
    const { stopImmediatePropagation } = event
    return Object.assign(event, {
      immediatePropagationStopped: false,
      stopImmediatePropagation() {
        this.immediatePropagationStopped = true
        stopImmediatePropagation.call(this)
      }
    })
  }
}
