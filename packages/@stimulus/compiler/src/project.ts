import { Bundle } from "./bundle"
import TSProject, { ModuleKind } from "ts-simple-ast"
import * as path from "path"

export type Source = { path: string, contents: string }

export class Project {
  rootDirectory: string
  tsProject: TSProject

  constructor(rootDirectory: string) {
    this.rootDirectory = path.resolve(rootDirectory)
    this.tsProject = new TSProject({
      compilerOptions: {
        module:  ModuleKind.ESNext,
        rootDir: this.rootDirectory,
        outDir:  this.outputDirectory,
        allowJs: true
      }
    })
  }

  get outputDirectory() {
    return path.join(this.rootDirectory, ".stimulus")
  }

  get controllersDirectory() {
    return path.join(this.rootDirectory, "controllers")
  }

  build() {
    this.addExistingSourceFiles()
    this.generateSourceFile(this.controllersIndexSource)
    this.generateSourceFile(this.applicationSource)
    this.generateSourceFile(this.indexSource)
    this.emit()
  }

  private addExistingSourceFiles() {
    const pattern = path.join(this.rootDirectory, "**", "*.js")
    this.tsProject.addExistingSourceFiles(pattern)
  }

  private generateSourceFile({ path, contents }: Source) {
    if (!this.tsProject.getSourceFile(path)) {
      this.tsProject.createSourceFile(path, contents)
    }
  }

  private emit() {
    this.tsProject.emit()
  }

  private get controllersIndexSource() {
    return {
      path: path.join(this.controllersDirectory, "index.js"),
      contents: this.controllersBundle.toString()
    }
  }

  private get applicationSource() {
    return {
      path: path.join(this.rootDirectory, "application.js"),
      contents: `
        import { Application } from "@stimulus/core"
        export default Application
      `
    }
  }

  private get indexSource() {
    return {
      path: path.join(this.rootDirectory, "index.js"),
      contents: `
        import Application from "./application"
        import controllerDefinitions from "./controllers"
        const application = new Application
        application.load(controllerDefinitions)
        application.start()
        export default application
      `
    }
  }

  private get controllersBundle() {
    return new Bundle(this.tsProject, this.controllersDirectory, module => {
      const formattedBasename = module.basename.replace(/_/g, "-")
      const { 1: identifier } = formattedBasename.match(/(.+)-controller\.js$/) || []

      if (identifier) {
        return `{ identifier: ${JSON.stringify(identifier)}, controllerConstructor: ${module.symbol} }`
      }
    })
  }
}
