const { RemovePrivateMethodsPlugin } = require("./remove_private_methods")

module.exports = pluginHost => {
  const app = pluginHost.owner
  app.converter.addComponent("remove-private-methods", RemovePrivateMethodsPlugin)
}
