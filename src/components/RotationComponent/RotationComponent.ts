import Vue from "vue";
import { Component, Prop, Watch, Model } from "vue-property-decorator";
import { ButtplugMessage, Device, RotateCmd, CreateSimpleRotateCmd, RotateSubcommand } from "buttplug";
const vueSlider = require("vue-slider-component");

@Component({
  components: {
    vueSlider,
  },
})
export default class RotationComponent extends Vue {
  @Prop()
  private device!: Device;

  @Prop({ default: -1 })
  private rotatorIndex!: number;

  private sliderValue: number = 0;
  private isDragging: boolean = false;

  private OnDragStart() {
    this.isDragging = true;
    this.$emit("dragstart");
  }

  private FireRotateCommand() {
    // If this is a slider for a specific feature, only address that.
    if (this.rotatorIndex >= 0) {
      this.$emit("devicemessage", this.device, new RotateCmd(
        [new RotateSubcommand(this.rotatorIndex, Math.abs(this.sliderValue / 100.0), this.sliderValue >= 0)]));
      return;
    }
    // Send to all motors
    this.$emit("devicemessage", this.device,
               CreateSimpleRotateCmd(this.device, Math.abs(this.sliderValue / 100.0), this.sliderValue >= 0));
  }

  private OnDragEnd() {
    this.isDragging = false;
    this.$emit("dragstop");
    this.FireRotateCommand();
  }

  private OnValueChanged(endValue: number) {
    if (this.isDragging) {
      return;
    }
    this.FireRotateCommand();
  }
}
