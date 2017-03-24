export function getFixture(): HTMLDivElement {
  return document.getElementById("qunit-fixture") as HTMLDivElement
}

export function setFixture(content: string | Element, callback) {
  if (typeof content == "string") {
    getFixture().innerHTML = content
  } else {
    getFixture().appendChild(content)
  }

  requestAnimationFrame(callback)
}
