<template>
  <div class="position-control">
    <h2>{{ device.Name }} - Position Control</h2>
    <vue-slider ref="positionSlider"
                :real-time="true"
                v-model="positionValue"
                @drag-start="OnDragStart"
                @drag-end="OnDragEnd"
                @callback="OnPositionValueChanged"
                :speed=".1" />
    <vue-slider ref="speedSlider"
                :real-time="true"
                v-model="speedValue"
                @drag-start="OnDragStart"
                @drag-end="OnDragEnd"
                @callback="OnSpeedValueChanged"
                :speed=".1" />
    <md-button ref="oscillate"
               class="md-raised md-primary"
               @click="OnOscillateClick"
               v-if="!isOscillating">Start Oscillation</md-button>
    <md-button ref="oscillate"
               class="md-raised md-primary"
               @click="OnOscillateClick"
               v-if="isOscillating">Stop Oscillation</md-button>
  </div>
</template>

<script lang="ts" src="./PositionComponent.ts">
</script>

<style lang="css">
</style>
