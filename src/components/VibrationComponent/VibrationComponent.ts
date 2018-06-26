import Vue from "vue";
import { Component, Prop, Watch, Model } from "vue-property-decorator";
import { ButtplugMessage, Device, VibrateCmd, SpeedSubcommand, CreateSimpleVibrateCmd } from "buttplug";
const vueSlider = require("vue-slider-component");

@Component({
  components: {
    vueSlider,
  },
})
export default class VibrationComponent extends Vue {
  @Prop()
  private device!: Device;

  @Prop({ default: -1 })
  private vibratorIndex!: number;

  private sliderValue: number = 0;
  private isDragging: boolean = false;

  private OnDragStart() {
    this.isDragging = true;
    this.$emit("dragstart");
  }

  private FireVibrateCommand() {
    // If this is a slider for a specific feature, only address that.
    if (this.vibratorIndex >= 0) {
      this.$emit("devicemessage", this.device, new VibrateCmd(
        [new SpeedSubcommand(this.vibratorIndex, this.sliderValue / 100.0)]));
      return;
    }
    // Send to all motors
    this.$emit("devicemessage", this.device, CreateSimpleVibrateCmd(this.device, this.sliderValue / 100.0));
  }

  private OnDragEnd() {
    this.isDragging = false;
    this.$emit("dragstop");
    this.FireVibrateCommand();
  }

  private OnValueChanged(endValue: number) {
    if (this.isDragging) {
      return;
    }
    this.FireVibrateCommand();
  }
}
