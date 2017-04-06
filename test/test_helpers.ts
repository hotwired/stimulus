const { test } = QUnit
export { test }

export function getFixture(): HTMLDivElement {
  return document.getElementById("qunit-fixture") as HTMLDivElement
}

export function setFixture(content: string | Element) {
  if (typeof content == "string") {
    getFixture().innerHTML = content
  } else {
    getFixture().appendChild(content)
  }

  return nextFrame()
}

export function nextFrame(): Promise<number> {
  return new Promise(requestAnimationFrame)
}
