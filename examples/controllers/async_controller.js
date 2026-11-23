import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [ "button" ]

  async sleep() {
    return new Promise(r => setTimeout(r, 1000));
  }


  async initialize() {
    await this.sleep();
    alert('async initialize complete')
  }

  async run() {
    await this.sleep();
    alert('Async function complete');
  }

  async throwError() {
    await this.sleep();
    throw Error('This error should be caught by stimulus, and stimulus should display a detailed error in the console');
  }
}
