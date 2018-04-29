import Vue from "vue";
import App from "./App";
const VueMaterial = require("vue-material");
const Icon = require("vue-awesome/components/Icon");
const VueTouch = require("vue-touch");
import * as ButtplugPanel from "vue-buttplug-material-component";
const MatomoTracker = require("matomo-tracker");

// Initialize with your site ID and Matomo URL
const matomo = new MatomoTracker(12, "https://apps.nonpolynomial.com/p/js/", true);

// Optional: Respond to tracking errors
matomo.on("error", function(err: string) {
  console.log("error tracking request: ", err);
});

// Track a request URL:
// Either as a simple string …
matomo.track({
  url: "https://buttplug.world/playground",
  action_name: "Buttplug Playground",
});

// Fix viewport scaling on iOS
require("viewport-units-buggyfill").init();

Vue.use(VueTouch);
Vue.use(VueMaterial);
Vue.use(ButtplugPanel);
Vue.component("icon", Icon);

// Ignore AFrame custom elements
Vue.config.ignoredElements = ["a-frame",
                              "a-box",
                              "a-sphere",
                              "a-cylinder",
                              "a-plane",
                              "a-sky",
                              "a-scene",
                              "a-entity",
                              "a-camera"];

// tslint:disable-next-line no-unused-expression
new Vue({
  el: "#app",
  render: (h) => h(App),
});
