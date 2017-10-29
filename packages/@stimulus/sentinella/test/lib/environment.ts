import { setFixture } from "./helpers"
import { Recorder } from "./delegate_recorders"

export interface Observer {
  start(): Function
  stop(): Function
}

export class TestEnvironment {
  element: Element
  childElement: Element
  attributeName: string
  recorder: Recorder
  observer: Observer

  static setup(observerConstructor, recorderConstructor) {
    const environment = new TestEnvironment(observerConstructor, recorderConstructor)
    environment.setup()
    return environment
  }

  constructor(observerConstructor, recorderConstructor) {
    this.element = document.createElement("div")
    this.childElement = document.createElement("span")
    this.attributeName = "data-test"
    this.recorder = new recorderConstructor
    this.observer = new observerConstructor(this.element, this.attributeName, this.recorder)
  }

  setup() {
    this.element.appendChild(this.childElement)
    setFixture(this.element)
    this.observer.start()
  }

  teardown() {
    this.observer.stop()
    setFixture("")
  }
}
