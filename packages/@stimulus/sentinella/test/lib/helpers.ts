import "@stimulus/polyfills"

const { test, module } = QUnit
export { test, module as testGroup }

export function getFixture(): HTMLDivElement {
  return document.getElementById("qunit-fixture") as HTMLDivElement
}

export function setFixture(content: string | Element) {
  if (typeof content == "string") {
    getFixture().innerHTML = content
  } else {
    getFixture().appendChild(content)
  }
}

export function nextFrame() {
  return new Promise(requestAnimationFrame)
}
