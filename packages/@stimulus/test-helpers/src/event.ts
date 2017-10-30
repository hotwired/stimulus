export function createEvent(eventType: string): Event {
  const event = document.createEvent("Events")
  event.initEvent(eventType, true, true)

  // IE <= 11 does not set `defaultPrevented` when `preventDefault()` is called on synthetic events
  const preventDefault = event.preventDefault
  event.preventDefault = function() {
    const result = preventDefault.call(this)
    Object.defineProperty(this, "defaultPrevented", {
      get: function() {
        return true
      },
      configurable: true
    })
    return result
  }

  return event
}
