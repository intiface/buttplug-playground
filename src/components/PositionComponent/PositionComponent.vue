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
    <vue-slider ref="timeSlider"
                :real-time="true"
                :min="0.1"
                :max="3"
                :interval="0.05"
                v-model="timeValue"
                @drag-start="OnDragStart"
                @drag-end="OnDragEnd"
                @callback="OnTimeValueChanged"
                :speed=".1" />
    <v-btn ref="oscillate"
           @click="OnOscillateClick"
           v-if="!isOscillating">Start Oscillation</v-btn>
    <v-btn ref="oscillate"
           @click="OnOscillateClick"
           v-if="isOscillating">Stop Oscillation</v-btn>
  </div>
</template>

<script lang="ts" src="./PositionComponent.ts">
</script>

<style lang="css">
</style>
