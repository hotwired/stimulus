# Glossary

* **[Application](src/stimulus/application.ts):** Top level interface for starting / stopping a Stimulus instance and registering controllers.

    ```js
    const app = Stimulus.Application.start()
    ```
* **[Router](src/stimulus/router.ts):** Manages constructing, connecting, and disconnecting registered controllers in response to DOM mutations.

* **[Controller](src/stimulus/controller.ts):** Base class for extending registered controllers. Provides `initialize`, `connect`, and `disconnect` callbacks, and access to the root element.

    ```js
    app.register("expander", class extends Stimulus.Controller {
      initialize() {
        // Called once
        console.log("initialize", this.element)
      }

      connect() {
        // Called when element is attached to the DOM
      }

      disconnect() {
        // Called when element is removed from the DOM
      }
    })
    ```

* **[TargetSet](src/stimulus/target_set.ts):** Controller interface for querying target elements.

* **[Dispatcher](src/stimulus/dispatcher.ts):** Manages event handlers for controller actions.

* **[Action](src/stimulus/action.ts):** Bundles together details for constructing an event handler: target element, event name, and method (object + method name).

* **[Descriptor](src/stimulus/descriptor.ts):** Holds an action's event name, method name, and preventDefault data. Parses action element attribute values.
