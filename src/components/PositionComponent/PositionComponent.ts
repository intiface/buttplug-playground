import Vue from "vue";
import { Component, Prop, Watch, Model } from "vue-property-decorator";
import { ButtplugMessage, Device } from "buttplug";
const vueSlider = require("vue-slider-component");

@Component({
  components: {
    vueSlider,
  },
})
export default class PositionComponent extends Vue {
  @Prop()
  private device: Device;
  @Model()
  private positionValue: number[] = [10, 90];
  @Model()
  private speedValue: number = 50;
  private isDragging: boolean = false;

  private OnDragStart() {
    this.isDragging = true;
  }

  private OnDragEnd() {
    this.isDragging = false;
    this.$emit("positionchange", this.device, this.positionValue);
  }

  private OnValueChanged(endValue: number) {
    if (this.isDragging) {
      return;
    }
    this.$emit("positionchange", this.device, endValue);
  }
}
