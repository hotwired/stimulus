import { Module } from "./module"
import TSProject, { Directory, SourceFile } from "ts-simple-ast"
import * as path from "path"

export type ExportReducer = (module: Module) => string | undefined

export class Bundle {
  tsProject: TSProject
  directory: string
  reducer: ExportReducer

  constructor(tsProject: TSProject, directory: string, reducer: ExportReducer) {
    this.tsProject = tsProject
    this.directory = directory
    this.reducer = reducer
  }

  get sourceFiles() {
    return this.tsProject.getSourceFiles(this.pattern)
  }

  get modules() {
    const symbols = createSymbolGenerator()
    return this.sourceFiles.map(sourceFile => new Module(this, sourceFile, symbols.next().value))
  }

  get importStatements() {
    return this.modules.map(module => module.importStatement).join("\n")
  }

  get exportExpression() {
    const body = this.modules.map(this.reducer)
      .reduce((exprs, expr) => exprs.concat(expr == null ? [] : [expr]), [] as string[])
    return "[" + body.join(", ") + "]"
  }

  private get pattern() {
    return path.join(this.directory, "*")
  }

  toString() {
    return `
      ${this.importStatements}
      export default ${this.exportExpression}
    `
  }
}

function *createSymbolGenerator() {
  let index = 0
  while (++index) {
    yield `module_${index}`
  }
}
