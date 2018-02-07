import Vue from "vue";
import { Component, Prop, Watch, Model } from "vue-property-decorator";
import { ButtplugMessage, Device, VorzeA10CycloneCmd } from "buttplug";
const vueSlider = require("vue-slider-component");

@Component({
  components: {
    vueSlider,
  },
})
export default class RotationComponent extends Vue {
  @Prop()
  private device!: Device;
  @Model()
  private sliderValue: number = 0;
  private isDragging: boolean = false;

  private OnDragStart() {
    this.isDragging = true;
    this.$emit("dragstart");
  }

  private OnDragEnd() {
    this.isDragging = false;
    this.$emit("dragstop");
    this.$emit("devicemessage", this.device, new VorzeA10CycloneCmd(Math.abs(this.sliderValue), this.sliderValue < 0));
  }

  private OnValueChanged(endValue: number) {
    if (this.isDragging) {
      return;
    }
    this.$emit("devicemessage", this.device, new VorzeA10CycloneCmd(Math.abs(endValue), endValue < 0));
  }
}
