import { patchOuter, elementOpen, elementClose, text } from "incremental-dom"

export class Replacement {
  readonly element: Element
  readonly html: string
  private readonly patch: (data: any) => void

  constructor(element: Element, html: string) {
    this.element = element
    this.html = html
    this.patch = PatchCompiler.compilePatchForElement(this.newElement)
  }

  private get newElement() {
    const container = document.createElement("body")
    container.innerHTML = this.html
    return container.firstElementChild
  }

  perform() {
    patchOuter(this.element, this.patch)
  }
}

class PatchCompiler {
  element: Element
  context: Context

  static compilePatchForElement(element: Element | null, context?: Context) {
    return element ? new this(element, context).callback : emptyCallback
  }

  constructor(element: Element, context: Context = defaultContext) {
    this.element = element
    this.context = context
  }

  get callback() {
    const instructions = this.instructions
    return () => instructions.forEach(([fn, args]) => fn.apply(null, args))
  }

  get instructions() {
    const open = [this.context.open, [this.tagName, null, null, ...this.attributes]]
    const close = [this.context.close, [this.tagName]]
    return [open, ...this.bodyInstructions, close] as Instruction[]
  }

  private get bodyInstructions() {
    return Array.from(this.element.childNodes).reduce((instructions, node) =>
      instructions.concat(
        this.textInstructionsForNode(node),
        this.elementInstructionsForNode(node)
      )
    , [] as Instruction[])
  }

  private textInstructionsForNode(node: Node): Instruction[] {
    if (node.nodeType == Node.TEXT_NODE) {
      const value = node.textContent || ""
      return [[this.context.text, [value]]]
    }
    return []
  }

  private elementInstructionsForNode(node: Node): Instruction[] {
    if (node.nodeType == Node.ELEMENT_NODE) {
      const patcher = new PatchCompiler(node as Element, this.context)
      return patcher.instructions
    }
    return []
  }

  private get attributes() {
    const attributes = Array.from(this.element.attributes)
    return attributes.reduce((_, { name, value }) => [..._, name, value], [] as string[])
  }

  private get tagName() {
    return this.element.tagName.toLowerCase()
  }
}

type Context = { open: Function, close: Function, text: Function }
type Instruction = [Function, any[]]

const defaultContext: Context = { open: elementOpen, close: elementClose, text }
const emptyCallback = () => {}
