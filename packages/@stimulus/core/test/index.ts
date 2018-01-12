const context = require.context("./cases", true, /\.ts$/)
const modules = context.keys().map(key => [key.slice(2), context(key).default])
modules.forEach(([path, constructor]) => constructor.defineModule(path))
