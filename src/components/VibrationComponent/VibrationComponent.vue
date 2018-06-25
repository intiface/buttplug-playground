<template>
  <div class="vibration">
    <h2>{{ device.Name }} - Vibration Control</h2>
    <div>
        <label>Speed</label>
        <vue-slider ref="speed-slider"
                    :real-time="true"
                    v-model="speedSliderValue">
        </vue-slider>
    </div>
    <div>
        <button v-on:click="PrevPattern"> &lt;= </button>
        Pattern
        <button v-on:click="NextPattern"> =&gt; </button>

    </div>
    <canvas width="800"
            height="300"
            ref="canvas"
            id="canvas"
            v-on:mousedown="MouseDown"
            v-on:mouseup="MouseUp"
            v-on:blur="MouseUp"
            v-on:mousemove="MouseMove"
    ></canvas>
  </div>
</template>

<script lang="ts" src="./VibrationComponent.ts">
</script>

<style lang="css">
    #canvas {
        background-color: #ff99ed;
    }
</style>
