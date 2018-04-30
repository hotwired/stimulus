import { RemovePrivateMethodsPlugin } from "./src/remove_private_methods"

export default pluginHost => {
  const app = pluginHost.owner
  app.converter.addComponent("remove-private-methods", RemovePrivateMethodsPlugin)
}
