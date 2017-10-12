<template>
  <div class="rotation">
    <h2>{{ device.Name }} - Rotation Control</h2>
    <vue-slider ref="slider"
                :real-time="true"
                :min="-100"
                :max="100"
                v-model="sliderValue"
                @drag-start="OnDragStart"
                @drag-end="OnDragEnd"
                @callback="OnValueChanged"
                @click="OnValueChanged">
    </vue-slider>
  </div>
</template>

<script lang="ts" src="./RotationComponent.ts">
</script>

<style lang="css">
</style>
