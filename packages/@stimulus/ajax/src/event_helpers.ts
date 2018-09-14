export function createEvent<T>(eventName: string, detail: T): CustomEvent<T> {
  const event = document.createEvent("CustomEvent")
  event.initCustomEvent(eventName, true, true, detail)
  return event
}
