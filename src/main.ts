import Vue from "vue";
import App from "./App.vue";
const Icon = require("vue-awesome/components/Icon");
const VueMaterial = require("vue-material");
const VueTouch = require("vue-touch");

// Fix viewport scaling on iOS
require("viewport-units-buggyfill").init();

Vue.use(VueTouch);
Vue.use(VueMaterial);
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
