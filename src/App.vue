<template>
  <v-app>
    <v-touch id="gesture-wrapper" v-on:swiperight="SideNavOpen" v-on:swipeleft="SideNavClose">
      <v-container>
        <header>
          <div id="sidetab-aligner"  @click="ToggleLeftSideNav">
            <div id="sidetab-arrow">
              <v-icon color="white" class="playicon">play_arrow</v-icon>
            </div>
            <div id="sidetab">
            </div>
          </div>
          <div ref="patreonButton" id="patreon-button">
            <div data-reactroot="" class="_2KV-widgets-shared--patreonWidgetWrapper"><a class="sc-bxivhb ffInCX" color="primary" type="button" href="https://www.patreon.com/bePatron?u=2860444&amp;redirect_uri=http%3A%2F%2Fbuttplug.world%2Ftest.html&amp;utm_medium=widget" role="button"><div class="sc-htpNat gdWQYu"><div class="sc-gzVnrw dJCpyC" display="flex" wrap="nowrap" direction="[object Object]"><div class="sc-dnqmqq llsQFn"><span class="sc-htoDjs fqfmvk"><svg viewBox="0 0 569 546" version="1.1" xmlns="http://www.w3.org/2000/svg"><title>Patreon logo</title><g><circle data-color="1" id="Oval" cx="362.589996" cy="204.589996" r="204.589996"></circle><rect data-color="2" id="Rectangle" x="0" y="0" width="100" height="545.799988"></rect></g></svg></span></div><div class="sc-gqjmRU fFOxVX" width="1.5"></div>Give us money</div></div></a></div>
          </div>
        </header>
        <div id="playground-container">
          <div v-if="this.devices.length === 0" class="select-message">
            <p>Click on the tab on the left or swipe right to connect to Buttplug and select a toy to test.</p>
          </div>
          <div v-for="device of this.devices">
            <position-component
              v-if="device.AllowedMessages.indexOf('FleshlightLaunchFW12Cmd') !== -1"
              :key="device.Index"
              :device="device"
              @devicemessage="OnDeviceMessage"
              @dragstart="OnDragStart"
              @dragstop="OnDragStop"
            />
            <vibration-component
              v-if="device.AllowedMessages.indexOf('VibrateCmd') !== -1"
              :key="device.Index + '-VibrateAll'"
              :device="device"
              @devicemessage="OnDeviceMessage"
              @dragstart="OnDragStart"
              @dragstop="OnDragStop"
            />
            <div v-if="device.AllowedMessages.indexOf('VibrateCmd') !== -1 && device.MessageAttributes('VibrateCmd').FeatureCount > 1">
              <vibration-component
                v-for="vibratorIndex in device.MessageAttributes('VibrateCmd').FeatureCount"
                :key="device.Index + '-Vibrate' + vibratorIndex"
                :device="device"
                :vibratorIndex="vibratorIndex - 1"
                @devicemessage="OnDeviceMessage"
                @dragstart="OnDragStart"
                @dragstop="OnDragStop"
              />
            </div>
            <rotation-component
              v-if="device.AllowedMessages.indexOf('RotateCmd') !== -1"
              :key="device.Index + 'RotateAll'"
              :device="device"
              @devicemessage="OnDeviceMessage"
              @dragstart="OnDragStart"
              @dragstop="OnDragStop"
            />
          </div>
        </div>
        <v-navigation-drawer
          temporary
          absolute
          v-model="menuOpened">
          <v-tabs>
            <v-tab href="#buttplugpanel">
              Buttplug
            </v-tab>
            <v-tab href="#aboutpanel">
              About
            </v-tab>
            <v-tabs-items>
              <v-tab-item id="buttplugpanel">
                <buttplug-panel
                  ref="buttplugPanel"
                  @deviceconnected="OnDeviceConnected"
                  @devicedisconnected="OnDeviceDisconnected"
                />
              </v-tab-item>
              <v-tab-item id="aboutpanel">
                <p><b>Buttplug Playground</b></p>
                <p>Version: <a :href="'https://github.com/metafetish/buttplug-playground/tree/' + config.build_commit">{{ config.build_commit }}</a></p>
                <p>Updated: {{ config.build_date }}</p>
                <p>Buttplug v{{ config.buttplug_version }}</p>
                <p>Component v{{ config.component_version }}</p>
                <p>Developed By <a href="https://metafetish.com">Metafetish</a></p>
                <p>Open Source! <a href="https://github.com/metafetish/buttplug-playground">Code available on Github</a></p>
                <p>We Like Money! <a href="https://patreon.com/qdot">Visit Our Patreon</a></p>
              </v-tab-item>
            </v-tabs-items>
          </v-tabs>
        </v-navigation-drawer>
      </v-container>
    </v-touch>
  </v-app>
</template>

<script lang="javascript">
 var _paq = _paq || [];
 /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
 _paq.push(["setCookieDomain", "*.buttplug.world"]);
 _paq.push(['trackPageView']);
 _paq.push(['enableLinkTracking']);
 (function() {
   var u="//matomo.nonpolynomial.com/";
   _paq.push(['setTrackerUrl', u+'piwik.php']);
   _paq.push(['setSiteId', '12']);
   var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
   g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);
 })();
</script>

<script lang="ts" src="./App.ts">
</script>

<style lang="css">
 /********************************/
 /* Fonts */
 /********************************/

 @font-face {
   font-family: 'Material Icons';
   font-style: normal;
   font-weight: 400;
   src: local('Material Icons'),
   local('MaterialIcons-Regular'),
   url(../static/fonts/MaterialIcons-Regular.woff2) format('woff2');
 }

 .material-icons {
   font-family: 'Material Icons';
   font-weight: normal;
   font-style: normal;
   font-size: 24px;  /* Preferred icon size */
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
   font-feature-settings: 'liga';
 }

 /********************************/
 /* Basic HTML styles */
 /********************************/
 
 html, body {
   margin: 0;
   padding: 0;
   height: 100vh;
   width: 100vw;
 }

 h1, h2 {
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
   font-family: Roboto,Noto Sans,Noto,sans-serif;
   -webkit-font-smoothing: antialiased;
   -moz-osx-font-smoothing: grayscale;
   color: #2c3e50;
 }

 #swipe-start-text {
   font-size:25px;
   z-index:50;
   left: 40px;
   position: fixed;
 }

 /********************************/
 /* Nav Drawer opener styles */
 /********************************/

 #sidetab-aligner {
   height: 100vh;
   display: flex;
   align-items: center;
   justify-content: center;
	 left: 0px;
	 position: fixed;
 }

 #sidetab {
	 background: #000;
   border: 2px solid #000;
	 height: 75px;
   left: 0;
	 width: 25px;
   border-top-right-radius: 15px;
   border-bottom-right-radius: 15px;
	 margin: 0;
	 padding: 0;
	 position: fixed;
	 display:block;
   z-index: 9998;
   cursor: pointer;
 }

 #sidetab-arrow {
   z-index: 9999;
   cursor: pointer;
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

 .select-message {
   display: flex;
   height: 100vh;
   align-items: center;
   justify-content: center;
   font-size: 25px;
   width: 100%;
 }

 .select-message p {
   width: 50%;
   line-height: 120%;
   text-align: center;
 }
</style>

<style src="vuetify/dist/vuetify.min.css"></style>
<style src="./PatreonButton.css"></style>
