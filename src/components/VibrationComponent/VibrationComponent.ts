import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import {ButtplugClientDevice, VibrationCmd } from "buttplug";
const vueSlider = require("vue-slider-component");

@Component({
  components: {
    vueSlider,
  },
})
export default class VibrationComponent extends Vue {
  @Prop()
  private device!: ButtplugClientDevice;

  @Prop({ default: -1 })
  private vibratorIndex!: number;

  private sliderValue: number = 0;
  private isDragging: boolean = false;

  private OnDragStart() {
    this.isDragging = true;
    this.$emit("dragstart");
  }

  private async FireVibrateCommand() {
    // If this is a slider for a specific feature, only address that.
    if (this.vibratorIndex >= 0) {
      await this.device.vibrate([new VibrationCmd(this.vibratorIndex, this.sliderValue / 100.0)]);
      return;
    }

    // Send to all motors
    await this.device.vibrate(this.sliderValue / 100.0);
  }

  private OnDragEnd() {
    this.isDragging = false;
    this.$emit("dragstop");
    this.FireVibrateCommand();
  }

  private async OnValueChanged(endValue: number) {
    // if (this.isDragging) {
    //   return;
    // }
    try {
      await this.FireVibrateCommand();
    } catch (e) {
      console.log("Got exception back!");
      console.log(e);
    }
  }
}
