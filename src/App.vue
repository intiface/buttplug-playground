<template>
  <v-app>
    <v-container fill-height>
      <header>
        <div ref="patreonButton" id="patreon-button">
          <div
            data-reactroot=""
            class="_2KV-widgets-shared--patreonWidgetWrapper"
          >
            <a
              class="sc-bxivhb ffInCX"
              color="primary"
              type="button"
              href="https://www.patreon.com/bePatron?u=2860444&amp;redirect_uri=http%3A%2F%2Fbuttplug.world%2Ftest.html&amp;utm_medium=widget"
              role="button"
              ><div class="sc-htpNat gdWQYu">
                <div
                  class="sc-gzVnrw dJCpyC"
                  display="flex"
                  wrap="nowrap"
                  direction="[object Object]"
                >
                  <div class="sc-dnqmqq llsQFn">
                    <span class="sc-htoDjs fqfmvk"
                      ><svg
                        viewBox="0 0 569 546"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <title>Patreon logo</title>
                        <g>
                          <circle
                            data-color="1"
                            id="Oval"
                            cx="362.589996"
                            cy="204.589996"
                            r="204.589996"
                          ></circle>
                          <rect
                            data-color="2"
                            id="Rectangle"
                            x="0"
                            y="0"
                            width="100"
                            height="545.799988"
                          ></rect>
                        </g></svg
                    ></span>
                  </div>
                  <div class="sc-gqjmRU fFOxVX" width="1.5"></div>
                  Give us money
                </div>
              </div></a
            >
          </div>
        </div>
      </header>
      <v-layout id="playground-container" column align-center justify-top>
        <v-flex shrink class="settings">
          <v-btn @click="ToggleDialog()" color="purple darken-2" dark>
            <v-icon dark left>settings</v-icon>Menu
          </v-btn>
        </v-flex>
        <v-divider class="top-divider"> </v-divider>
        <v-flex v-if="!this.client">
          <h1>Not Connected.</h1>
        </v-flex>
        <v-flex
          v-if="
            this.client && this.client.connected && this.devices.length === 0
          "
        >
          <h1>No Devices Activated.</h1>
        </v-flex>
        <v-flex v-for="device of this.devices" :key="device.index" shrink>
          <position-component
            v-if="canLinear(device)"
            :key="device.index + 'LinearAll'"
            :device="device"
            @dragstart="OnDragStart"
            @dragstop="OnDragStop"
          />
          <vibration-component
            v-if="canVibrate(device)"
            :key="device.index + '-VibrateAll'"
            :device="device"
            @dragstart="OnDragStart"
            @dragstop="OnDragStop"
          />
          <div v-if="numVibrators(device) > 1">
            <vibration-component
              v-for="vibratorIndex in numVibrators(device)"
              :key="device.index + '-Vibrate' + vibratorIndex"
              :device="device"
              :vibratorIndex="vibratorIndex - 1"
              @dragstart="OnDragStart"
              @dragstop="OnDragStop"
            />
          </div>
          <rotation-component
            v-if="canRotate(device)"
            :key="device.index + 'RotateAll'"
            :device="device"
            @dragstart="OnDragStart"
            @dragstop="OnDragStop"
          />
        </v-flex>
      </v-layout>
      <v-dialog
        :content-class="
          $vuetify.breakpoint.smAndDown
            ? 'main-dialog'
            : 'main-dialog tab-panel'
        "
        v-model="menuOpened"
        :fullscreen="$vuetify.breakpoint.smAndDown"
        :hide-overlay="$vuetify.breakpoint.smAndDown"
        max-width="60%"
      >
        <v-toolbar
          dark
          color="purple darken-2"
          v-if="$vuetify.breakpoint.smAndDown"
        >
          <v-toolbar-side-icon>
            <v-btn icon @click="ToggleDialog">
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar-side-icon>
          <v-toolbar-title>Buttplug Playground</v-toolbar-title>
        </v-toolbar>
        <v-layout column>
          <v-tabs class="fixed-tabs-bar">
            <v-tab href="#intifacepanel"> Intiface </v-tab>
            <v-tab href="#helppanel"> Help </v-tab>
            <v-tab href="#aboutpanel"> About </v-tab>
            <v-tab-item value="intifacepanel">
              <buttplug-panel
                :client="client"
                @selecteddeviceschange="OnSelectedDevicesChange"
              />
            </v-tab-item>
            <v-tab-item value="aboutpanel">
              <v-card flat class="about-card">
                <p><b>Buttplug Playground</b></p>
                <p>
                  Version:
                  <a
                    :href="
                      'https://github.com/metafetish/buttplug-playground/tree/' +
                      config.build_commit
                    "
                    >{{ config.build_commit }}</a
                  >
                </p>
                <p>Updated: {{ config.build_date }}</p>
                <p>Buttplug v{{ config.buttplug_version }}</p>
                <p>Component v{{ config.component_version }}</p>
                <p>
                  Developed By <a href="https://metafetish.com">Metafetish</a>
                </p>
                <p>
                  Open Source!
                  <a href="https://github.com/metafetish/buttplug-playground"
                    >Code available on Github</a
                  >
                </p>
                <p>
                  We Like Money!
                  <a href="https://patreon.com/qdot">Visit Our Patreon</a>
                </p>
              </v-card>
            </v-tab-item>
            <v-tab-item value="helppanel" class="help-panel" v-html="helpText">
            </v-tab-item>
          </v-tabs>
        </v-layout>
      </v-dialog>
    </v-container>
  </v-app>
</template>

<script lang="ts" src="./App.ts">
</script>

<style lang="css">
/********************************/
/* Fonts */
/********************************/

@font-face {
  font-family: "Material Icons";
  font-style: normal;
  font-weight: 400;
  src: local("Material Icons"), local("MaterialIcons-Regular"),
    url(../static/fonts/MaterialIcons-Regular.woff2) format("woff2");
}

.main-dialog {
  background: #fff;
}

.material-icons {
  font-family: "Material Icons";
  font-weight: normal;
  font-style: normal;
  font-size: 24px; /* Preferred icon size */
  display: inline-block;
  line-height: 1;
  text-transform: none;
  letter-spacing: normal;
  word-wrap: normal;
  white-space: nowrap;
  direction: ltr;

  /* Support for all WebKit browsers. */
  -webkit-font-smoothing: antialiased;
  /* Support for Safari and Chrome. */
  text-rendering: optimizeLegibility;

  /* Support for Firefox. */
  -moz-osx-font-smoothing: grayscale;

  /* Support for IE. */
  font-feature-settings: "liga";
}

/********************************/
/* Basic HTML styles */
/********************************/

html,
body {
  margin: 0;
  padding: 0;
}

h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

/********************************/
/* App container styles */
/********************************/

/* Make our touch wrapper div take up the whole screen, but also make it
    fixed so that we don't have problems with readjustment snapping */
#gesture-wrapper {
  position: fixed;
  height: 100%;
  width: 100%;
}

#app {
  height: 100%;
  width: 100%;
  font-size: 16px;
  font-weight: 400;
  text-align: left;
  text-transform: none;
  font-family: Roboto, Noto Sans, Noto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#swipe-start-text {
  font-size: 25px;
  z-index: 50;
  left: 40px;
  position: fixed;
}

/********************************/
/* Misc application styles */
/********************************/

#playground-container {
  width: 80%;
  margin: auto;
}

.vue-slider {
  margin-top: 20px;
  margin-bottom: 20px;
}

.settings {
  font-size: 24px;
}

.top-divider {
  width: 100%;
  padding-top: 5px;
  padding-bottom: 5px;
}

.settings-icon {
  vertical-align: middle;
}

.about-card {
  padding: 10px;
}

.tab-panel {
  min-height: 60%;
  max-height: 60%;
  height: 60%;
}

.help-panel {
  padding: 5px;
}

.help-panel img {
  max-width: 90%;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.help-panel ul {
  list-style: square outside;
}

.help-panel li {
  display: list-item;
}

.help-panel h2,
h3,
h4 {
  margin-top: 1em;
}

.fixed-tabs-bar .v-tabs__bar {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  z-index: 2;
}
</style>

<style src="vuetify/dist/vuetify.min.css"></style>
<style src="./PatreonButton.css"></style>
