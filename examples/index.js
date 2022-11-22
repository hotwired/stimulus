import { Application } from "@hotwired/stimulus"
import "@hotwired/turbo"

const application = Application.start()

import ClipboardController from "./controllers/clipboard_controller"
application.register("clipboard", ClipboardController)

import ContentLoaderController from "./controllers/content_loader_controller"
application.register("content-loader", ContentLoaderController)

import HelloController from "./controllers/hello_controller"
application.register("hello", HelloController)

import SlideshowController from "./controllers/slideshow_controller"
application.register("slideshow", SlideshowController)

import TabsController from "./controllers/tabs_controller"
application.register("tabs", TabsController)
