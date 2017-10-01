<template>
  <div class="vibration">
    <h2>{{ device.Name }} - Vibration Control</h2>
    <vue-slider ref="slider"
                :real-time="true"
                v-model="sliderValue"
                @drag-start="OnDragStart"
                @drag-end="OnDragEnd"
                @callback="OnValueChanged"
                @click="OnValueChanged">
    </vue-slider>
  </div>
</template>

<script lang="ts" src="./VibrationComponent.ts">
</script>

<style lang="css">
</style>
