import Vue from "vue";
import Vuetify from "vuetify";
import App from "./App.vue";
const Icon = require("vue-awesome/components/Icon");
const VueTouch = require("vue-touch");
import * as ButtplugPanel from "vue-buttplug-material-component";
const MatomoTracker = require("matomo-tracker");

// Initialize with your site ID and Matomo URL
const matomo = new MatomoTracker(12, "https://matomo.nonpolynomial.com/", true);

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
Vue.use(Vuetify);
Vue.use(ButtplugPanel);
Vue.component("icon", Icon);

// tslint:disable-next-line no-unused-expression
new Vue({
  el: "#app",
  render: (h) => h(App),
});
