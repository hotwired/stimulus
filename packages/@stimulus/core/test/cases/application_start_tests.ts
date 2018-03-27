import { DOMTestCase } from "@stimulus/test"

export default class ApplicationStartTests extends DOMTestCase {
  iframe: HTMLIFrameElement

  async setup() {
    this.iframe = document.createElement("iframe")
    this.iframe.src = "/core/application/index.html"
    this.fixtureElement.appendChild(this.iframe)
  }

  async "test starting an application when the document is loading"() {
    const message = await this.messageFromStartState("loading")
    this.assert.notEqual(message.connectState, "loading")
    this.assert.equal(message.targetCount, 3)
  }

  async "test starting an application when the document is interactive"() {
    const message = await this.messageFromStartState("interactive")
    this.assert.equal(message.targetCount, 3)
  }

  async "test starting an application when the document is complete"() {
    const message = await this.messageFromStartState("complete")
    this.assert.equal(message.targetCount, 3)
  }

  private messageFromStartState(startState: string): Promise<any> {
    return new Promise(resolve => {
      const receiveMessage = event => {
        if (event.source == this.iframe.contentWindow) {
          const message = JSON.parse(event.data)
          if (message.startState == startState) {
            removeEventListener("message", receiveMessage)
            resolve(message)
          }
        }
      }
      addEventListener("message", receiveMessage)
    })
  }
}


