<template>
  <div class="position-control">
    <h2>{{ device.Name }} - Position Control</h2>
    <vue-slider ref="positionSlider"
                :real-time="true"
                v-model="positionValue"
                @drag-start="OnDragStart"
                @drag-end="OnDragEnd"
                @callback="OnValueChanged"
                @click="OnValueChanged" />
    <vue-slider ref="speedSlider"
                :real-time="true"
                v-model="speedValue"
                @drag-start="OnDragStart"
                @drag-end="OnDragEnd"
                @callback="OnValueChanged"
                @click="OnValueChanged" />
  </div>
</template>

<script lang="ts" src="./PositionComponent.ts">
</script>

<style lang="css">
</style>
