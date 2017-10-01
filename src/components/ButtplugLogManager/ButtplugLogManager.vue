<template>
  <div id="buttplug-log-manager">
    <textarea ref="logArea">{{ logMessages.join("\n") }}</textarea>
    <br/>
    <md-select v-model="logLevel" @change="LogLevelChange">
      <md-option value="Off">Off</md-option>
      <md-option value="Fatal">Fatal</md-option>
      <md-option value="Error">Error</md-option>
      <md-option value="Warn">Warn</md-option>
      <md-option value="Info">Info</md-option>
      <md-option value="Debug">Debug</md-option>
      <md-option value="Trace">Trace</md-option>
    </md-select>
  </div>
</template>

<script lang="ts" src="./ButtplugLogManager.ts">
</script>

<style lang="css">
 #buttplug-log-manager textarea {
   width:28em;
   height:20em;
   overflow: auto;
   font-size: 9px;
   white-space: pre;
 }
</style>
