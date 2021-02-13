import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { ButtplugClientDevice } from "buttplug";
const vueSlider = require("vue-slider-component");

@Component({
  components: {
    vueSlider,
  },
})
export default class PositionComponent extends Vue {
  @Prop()
  private device!: ButtplugClientDevice;

  // Not using property decorators for these models because we need to set up
  // dragging.
  private goalPositionIndex: number = 0;
  private positionValue: number[] = [10, 90];
  private timeValue: number = 1.5;

  private isDragging: boolean = false;
  private isOscillating: boolean = false;
  private goalPosition: number = 0;
  private goalTime: number = 0;

  private OnDragStart() {
    this.isDragging = true;
    this.$emit("dragstart");
  }

  private OnDragEnd() {
    this.isDragging = false;
    this.$emit("dragstop");
  }

  private OnPositionValueChanged(endValue: number[]) {
    if (this.isDragging) {
      return;
    }
    this.positionValue = endValue;
  }

  private OnTimeValueChanged(endValue: number) {
    if (this.isDragging) {
      return;
    }
    this.timeValue = endValue;
  }

  private onOscillationTick() {
    window.requestAnimationFrame(async () => {
      if (!this.isOscillating) {
        return;
      }
      // If we're past the goal time, assume we've moved far enough, create and
      // send the next message.
      if (Date.now() < this.goalTime) {
        this.onOscillationTick();
        return;
      }
      await this.device.linear(this.positionValue[this.goalPositionIndex] * 0.01, this.timeValue * 1000);

      // flip goal position index
      this.goalPositionIndex ^= 1;
      this.goalTime = Date.now() + (this.timeValue * 1000);
      this.onOscillationTick();
    });
  }

  private OnOscillateClick() {
    if (!this.isOscillating) {
      this.isOscillating = true;
      this.onOscillationTick();
    } else {
      this.isOscillating = false;
      this.goalTime = 0;
    }
  }
}
