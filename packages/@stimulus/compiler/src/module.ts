import { Bundle } from "./bundle"
import { SourceFile } from "ts-simple-ast"
import * as path from "path"

export class Module {
  bundle: Bundle
  sourceFile: SourceFile
  symbol: string

  constructor(bundle: Bundle, sourceFile: SourceFile, symbol: string) {
    this.bundle = bundle
    this.sourceFile = sourceFile
    this.symbol = symbol
  }

  get path() {
    return this.sourceFile.getFilePath()
  }

  get basename() {
    return this.sourceFile.getBaseName()
  }

  get directory() {
    return this.bundle.directory
  }

  get importStatement() {
    return `import ${this.symbol} from ${JSON.stringify(this.relativePath)}`
  }

  get relativePath() {
    const relativePath = path.relative(this.directory, this.path)
    return `./${relativePath.replace(/\.js$/, "")}`
  }
}
