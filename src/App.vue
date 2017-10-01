<template>
  <div id="app">
    <v-touch id="gesture-wrapper" v-on:swiperight="SideNavOpen" v-on:swipeleft="SideNavClose">
      <header>
        <div id="sidetab-aligner"  @click="ToggleLeftSideNav">
          <div id="sidetab-arrow">
            <md-icon>play_arrow</md-icon>
          </div>
          <div id="sidetab">
          </div>
          <div ref="swipeStartText" id="swipe-start-text">Tap/Click Or Swipe Right</div>
        </div>
        <div ref="patreonButton" id="patreon-button">
          <div data-reactroot="" class="_2KV-widgets-shared--patreonWidgetWrapper"><a class="sc-bxivhb ffInCX" color="primary" type="button" href="https://www.patreon.com/bePatron?u=2860444&amp;redirect_uri=http%3A%2F%2Fbuttplug.world%2Ftest.html&amp;utm_medium=widget" role="button"><div class="sc-htpNat gdWQYu"><div class="sc-gzVnrw dJCpyC" display="flex" wrap="nowrap" direction="[object Object]"><div class="sc-dnqmqq llsQFn"><span class="sc-htoDjs fqfmvk"><svg viewBox="0 0 569 546" version="1.1" xmlns="http://www.w3.org/2000/svg"><title>Patreon logo</title><g><circle data-color="1" id="Oval" cx="362.589996" cy="204.589996" r="204.589996"></circle><rect data-color="2" id="Rectangle" x="0" y="0" width="100" height="545.799988"></rect></g></svg></span></div><div class="sc-gqjmRU fFOxVX" width="1.5"></div>Give us money</div></div></a></div>
        </div>
      </header>
      <div id="playground-container">
        <div v-for="device of this.devices">
          <position-component
            v-if="device.AllowedMessages.indexOf('FleshlightLaunchFW12Cmd') !== -1"
            :key="device.Index"
            :device="device"
          />
          <vibration-component
            v-if="device.AllowedMessages.indexOf('SingleMotorVibrateCmd') !== -1"
            :key="device.Index"
            :device="device"
            @vibratechange="OnVibrateChange"
          />
        </div>
      </div>
      <md-sidenav
        layout="column"
        class="md-left"
        id="leftSideNavElement"
        ref="leftSideNav">
        <md-tabs md-centered>
          <md-tab md-label="Buttplug">
            <buttplug-panel-component
              ref="buttplugPanel"
              @deviceconnected="OnDeviceConnected"
              @devicedisconnected="OnDeviceDisconnected"
            />
          </md-tab>
          <md-tab md-label="About">
            <md-list class="md-double-line">
              <md-list-item><b>Buttplug Playground Version 20170925</b></md-list-item>
              <md-list-item><div class="md-list-text-container">Developed By<a href="https://metafetish.com">Metafetish</a></div></md-list-item>
              <md-list-item><div class="md-list-text-container">Open Source!<a href="https://github.com/metafetish/buttplug-playground">Code available on Github</a></div></md-list-item>
              <md-list-item><div class="md-list-text-container">We Like Money!<a href="https://patreon.com/qdot">Visit Our Patreon</a></div></md-list-item>
            </md-list>
          </md-tab>
        </md-tabs>
      </md-sidenav>
    </v-touch>
  </div>
</template>

<script lang="ts" src="./App.ts">
</script>

<style src="vue-material/dist/vue-material.css"></style>

<style lang="css">
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

 html, body {
   margin: 0;
   padding: 0;
   height: 100vh;
   width: 100vw;
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

 /* Make our touch wrapper div take up the whole screen, but also make it
    fixed so that we don't have problems with readjustment snapping */
 #gesture-wrapper {
   position: fixed;
   height: 100%;
   width: 100%;
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

 .md-input-container.md-has-value input {
   font-size:10pt;
 }

 md-sidenav,
 md-sidenav.md-locked-open,
 md-sidenav.md-closed.md-locked-open-add-active {
   min-width: 200px !important;
   width: 85vw !important;
   max-width: 400px !important;
 }

 .md-tabs .md-tab  {
   padding: 0;
 }

 .haptics-info {
   font-size: 14px;
 }

 #hamburger-start-text {
   position: fixed;
   font-size:25px;
   z-index:50;
   top: 33px;
   left: 85px;
 }

 #swipe-start-text {
   font-size:25px;
   z-index:50;
   left: 40px;
   position: fixed;
 }

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
   color: #fff;
   margin: auto;
   text-align: right;
   z-index: 9999;
   cursor: pointer;
 }

 #playground-container {
   width: 80%;
   margin: auto;
 }

 .syncydink-nav-file-input {
   max-width: 95%;
   margin: auto;
 }

 ._2KV-widgets-shared--patreonWidgetWrapper {
   color: #052D49;
   font-family: 'America', 'GT America', 'Lato', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
   font-size: 16px;
   -webkit-font-smoothing: antialiased;
   -moz-osx-font-smoothing: grayscale;
   text-rendering: optimizeLegibility;
 }

 /* Patreon button rendering CSS */

 #patreon-button {
   position: absolute;
   bottom: 0;
   right: 0;
 }

 /* sc-component-id: sc-keyframes-iECmZH */
 @-webkit-keyframes iECmZH{0%{-webkit-transform:rotate(0deg);-ms-transform:rotate(0deg);transform:rotate(0deg);}100%{-webkit-transform:rotate(360deg);-ms-transform:rotate(360deg);transform:rotate(360deg);}}@keyframes iECmZH{0%{-webkit-transform:rotate(0deg);-ms-transform:rotate(0deg);transform:rotate(0deg);}100%{-webkit-transform:rotate(360deg);-ms-transform:rotate(360deg);transform:rotate(360deg);}}
 /* sc-component-id: sc-htpNat */
 .sc-htpNat {}
 .gdWQYu{visibility:visible;}
 /* sc-component-id: sc-bxivhb */
 .sc-bxivhb {}
 .ffInCX{-webkit-backface-visibility:hidden;backface-visibility:hidden;background-color:#F96854;border:2px solid #F96854;border-radius:0;box-sizing:border-box;color:#FFFFFF !important;display:inline-block;font-size:0.8090234857849197rem !important;font-weight:700;padding:0.5rem 0.75rem;position:relative;text-align:center;text-decoration:none;text-transform:uppercase;-webkit-transition:all 300ms cubic-bezier(0.19,1,0.22,1);transition:all 300ms cubic-bezier(0.19,1,0.22,1);-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;white-space:nowrap;cursor:pointer;}.ffInCX:focus{box-shadow:0 0 8px 0 #358EFF;outline:none;}.ffInCX:hover{background-color:#FA7664;border-color:#FA7664;box-shadow:0 0.25rem 0.75rem rgba(5,45,73,0.09999999999999998);}.ffInCX:active{box-shadow:none;-webkit-transform:translateY(0);-ms-transform:translateY(0);transform:translateY(0);}
 /* sc-component-id: sc-gzVnrw */
 .sc-gzVnrw {}
 .dJCpyC{-webkit-align-content:flex-start;-ms-flex-line-pack:flex-start;align-content:flex-start;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-grow:initial;-ms-flex-grow:initial;flex-grow:initial;-webkit-flex-wrap:nowrap;-ms-flex-wrap:nowrap;flex-wrap:nowrap;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;styled-components:bug-fix;}@media (min-width:1rem){.dJCpyC{-webkit-flex-direction:row;-ms-flex-direction:row;flex-direction:row;}}
 /* sc-component-id: sc-htoDjs */
 .sc-htoDjs {}
 .fqfmvk{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;}.fqfmvk svg{-webkit-align-self:center;-ms-flex-item-align:center;align-self:center;height:0.75rem;width:0.75rem;}.fqfmvk svg *[data-color='1']{fill:#FFFFFF;-webkit-transition:all 300ms cubic-bezier(0.19,1,0.22,1);transition:all 300ms cubic-bezier(0.19,1,0.22,1);}.fqfmvk svg *[data-color='2']{fill:#052D49;-webkit-transition:all 300ms cubic-bezier(0.19,1,0.22,1);transition:all 300ms cubic-bezier(0.19,1,0.22,1);}
 /* sc-component-id: sc-dnqmqq */
 .sc-dnqmqq {}
 .llsQFn{-webkit-align-self:center;-ms-flex-item-align:center;align-self:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;display:-webkit-inline-box !important;display:-webkit-inline-flex !important;display:-ms-inline-flexbox !important;display:inline-flex !important;padding:NaNrem;}
 /* sc-component-id: sc-gqjmRU */
 .sc-gqjmRU {}
 .fFOxVX{width:0.75rem;height:1px;}

.vue-slider {
   margin-top: 20px;
   margin-bottom: 20px;
 }

</style>
