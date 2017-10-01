<template>
  <div id="buttplug-panel">
    <md-list>
      <md-subheader>Connection</md-subheader>
      <md-list-item class="lower-divider">
        <buttplug-connection-manager-component
          width="100%"
          v-bind:isConnected="isConnected"
          v-on:connectwebsocket="ConnectWebsocket"
          v-on:connectlocal="ConnectLocal"
          v-on:disconnect="Disconnect"/>
      </md-list-item>
      <div v-show="isConnected">
      <md-subheader>Devices</md-subheader>
      <md-list-item class="lower-divider">
        <buttplug-device-manager-component
          v-bind:devices="devices"
          v-bind:isConnected="isConnected"
          v-on:selectedDevicesChanged="OnSelectedDevicesChanged"
          v-on:startScanning="StartScanning"
          v-on:stopScanning="StopScanning" />
      </md-list-item>
      </div>
      <div v-show="isConnected">
      <md-subheader>Log Messages</md-subheader>
      <md-list-item class="lower-divider">
        <buttplug-log-manager-component
          v-bind:isConnected="isConnected"
          v-bind:logMessages="logMessages"
          v-on:loglevel="SetLogLevel"/>
      </md-list-item>
      </div>
    </md-list>
  </div>
</template>

<script lang="ts" src="./ButtplugPanel.ts">
</script>

<style lang="css">

 .buttplug-sidebar {
   min-width: 95%;
 }

 .lower-divider {
   padding-bottom: 5px;
   border-bottom: 1px #bbb solid;
 }
</style>
