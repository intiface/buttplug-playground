import Vue from "vue";
// use vuetify/lib, otherwise vue-loader won't optimize components at all.
import Vuetify from "vuetify/lib";
import App from "./App.vue";
import { buttplugInit } from "buttplug";
// Import vue-buttplug-material-component from the src, otherwise vue-loader
// won't optimize the components correctly.
// import * as ButtplugPanel from "vue-buttplug-material-component/src";
const Icon = require("vue-awesome/components/Icon");
const MatomoTracker = require("matomo-tracker");

// Initialize with your site ID and Matomo URL
const matomo = new MatomoTracker(12, "https://matomo.nonpolynomial.com/piwik.php", true);

declare var __webpack_public_path__: any;
/*
var scripts = document.getElementsByTagName( "script" );
var lastScript = scripts[scripts.length - 1].src;
__webpack_public_path__ = lastScript.substr(0, lastScript.lastIndexOf('/') + 1);
*/
buttplugInit().then(() => {

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

Vue.use(Vuetify);
// Vue.use(ButtplugPanel.install);
Vue.component("icon", Icon);

// tslint:disable-next-line no-unused-expression
new Vue({
  el: "#app",
  render: (h) => h(App),
});
});