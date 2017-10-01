import Vue from "vue";
import { Component, Prop, Watch, Model } from "vue-property-decorator";
import { ButtplugMessage, Device } from "buttplug";
const vueSlider = require("vue-slider-component");

@Component({
  components: {
    vueSlider,
  },
})
export default class VibrationComponent extends Vue {
  @Prop()
  private device: Device;
  @Model()
  private sliderValue: number = 0;
  private isDragging: boolean = false;

  private OnDragStart() {
    this.isDragging = true;
  }

  private OnDragEnd() {
    this.isDragging = false;
    this.$emit("vibratechange", this.device, this.sliderValue);
  }

  private OnValueChanged(endValue: number) {
    if (this.isDragging) {
      return;
    }
    this.$emit("vibratechange", this.device, endValue);
  }
}
