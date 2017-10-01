<template>
  <div id="buttplug-device-manager">
    <md-list>
      <md-list-item
        v-for="device in devices"
        :key="device.Id"
        class="buttplug-device-checkbox">
        <md-checkbox
          @change="onCheckboxChange($event, device.Index)">{{ device.Index + ": " + device.Name }}</md-checkbox>
      </md-list-item>
    </md-list>
    <md-button
      @click="ScanningClicked"
      v-model="scanningText"
      class="md-raised md-primary">{{ scanningText }}</md-button>
    <span v-show="isScanning">
      <md-spinner :md-size="40" md-indeterminate />
    </span>
  </div>
</template>

<script lang="ts" src="./ButtplugDeviceManager.ts">
</script>

<style lang="css">
 .buttplug-device-manager label {
   font-size: 14px;
 }

</style>
