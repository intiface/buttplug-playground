import Vue from "vue";
import { Component, Prop, Watch, Model } from "vue-property-decorator";
import { ButtplugMessage, Device, FleshlightLaunchFW12Cmd } from "buttplug";
const vueSlider = require("vue-slider-component");

@Component({
  components: {
    vueSlider,
  },
})
export default class PositionComponent extends Vue {
  @Prop()
  private device!: Device;

  // Not using property decorators for these models because we need to set up
  // dragging.
  private positionValue: number[] = [10, 90];
  private speedValue: number = 50;

  private isDragging: boolean = false;
  private isOscillating: boolean = false;
  private currentPosition: number = 0;
  private goalPosition: number = 0;
  private goalTime: number = 0;
  private isMovingUp: boolean = false;

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

  private OnSpeedValueChanged(endValue: number) {
    if (this.isDragging) {
      return;
    }
    this.speedValue = endValue;
  }

  // Speed = 25000 * (Duration * 90/Distance)^(-1.05)
  // Duration = ((Speed / 25000) ^ (1/-1.05)) / (90/Distance)
  private calculateCommandTiming() {
    const positionDelta = Math.abs(this.currentPosition - this.goalPosition);
    const timeDelta = Math.floor(Math.pow((this.speedValue / 25000), (1 / -1.05)) / (90.0 / positionDelta));
    this.goalTime = Date.now() + timeDelta;
  }

  private onOscillationTick() {
    window.requestAnimationFrame(() => {
      if (!this.isOscillating) {
        return;
      }
      // If we're past the goal time, assume we've moved far enough, create and
      // send the next message.
      if (Date.now() < this.goalTime) {
        this.onOscillationTick();
        return;
      }
      if (!this.isMovingUp) {
        this.currentPosition = this.positionValue[1];
        this.goalPosition = this.positionValue[0];
        this.isMovingUp = true;
      } else {
        this.currentPosition = this.positionValue[0];
        this.goalPosition = this.positionValue[1];
        this.isMovingUp = false;
      }
      this.calculateCommandTiming();
      this.$emit("devicemessage", this.device, new FleshlightLaunchFW12Cmd(this.speedValue, this.goalPosition));
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
