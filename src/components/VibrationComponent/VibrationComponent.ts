import Vue from "vue";
import { Component, Prop, Watch, Model } from "vue-property-decorator";
import { ButtplugMessage, Device, SingleMotorVibrateCmd } from "buttplug";
import { Pattern } from "../../pattern";
const vueSlider = require("vue-slider-component");

// note: units are fraction of canvas width or height
const curValX = 0.05;
const minY = 0.05;
const maxY = 0.95;
const vibeHeight = 0.05;

// note: units are seconds
const timelineLength = 8.0;
const thrustPeriod = 0.5;
const thrustDuration = 0.25;
const wavePeriod = 7;

const numPoints = 400;
const timePerPoint = timelineLength / numPoints;
const curValPoint = Math.round(curValX * numPoints);

const patterns = [
  new Pattern("wave", wavePeriod, (time) => {
    return (1 + Math.sin(time * Math.PI * 2 / wavePeriod)) / 2.0;
  }),

  new Pattern("thrust", thrustPeriod, (time) => {
    return ((time % thrustPeriod) > thrustDuration) ? 0.0 : 1.0;
  }),

  new Pattern("thrust-wave", wavePeriod, (time) => {
    const onOff = ((time % thrustPeriod) > thrustDuration) ? 0.0 : 1.0;
    return onOff * (1 + Math.sin(Math.floor(time / thrustPeriod) * thrustPeriod * Math.PI * 2 / wavePeriod)) / 2.0;
  }),
];

@Component({
  components: {
    vueSlider,
  },
})
export default class VibrationComponent extends Vue {
  @Prop()
  private device!: Device;
  private speedSliderValue: number = 50;
  private points: number[] = [];
  private headOfPoints: number = 0;
  private headTime: number = 0;
  private curPattern: number = -1;
  private patternMinVal: number = 0.1; // FIXME: set to 0 when ditto handles values < 0.1
  private patternMaxVal: number = 1.0;
  private lastInputtedVal: number = 0;
  private dragging: boolean = false;

  // cached computed state just to avoid recomputting it
  private ctx!: CanvasRenderingContext2D;
  private curVal: number = 0;
  private speed: number = 1.0;
  private subtimeOffset: number = 0;
  private subposOffset: number = 0;
  private width: number = 0;
  private height: number = 0;
  private x: number = 0;
  private y: number = 0;

  private MouseDown(e: MouseEvent) {
    this.dragging = true;
    this.handleDrag(e);
  }

  private MouseUp(e: MouseEvent) {
    this.dragging = false;
  }

  private MouseMove(e: MouseEvent) {
    if (this.dragging) {
      this.handleDrag(e);
    }
  }

  private NextPattern() {
    let pattern = this.curPattern + 1;
    if (pattern === patterns.length) {
      pattern = -1;
    }
    this.SetPattern(pattern);
  }

  private PrevPattern() {
    let pattern = this.curPattern - 1;
    if (pattern === -2) {
      pattern = patterns.length - 1;
    }
    this.SetPattern(pattern);
  }

  private SetPattern(pattern: number) {
    this.curPattern = pattern;
    this.headTime = 0;
    this.headOfPoints = 0;
    this.subtimeOffset = 0;
    this.subposOffset = 0;

    if (this.curPattern === -1) {
      for (let i = 0; i < numPoints; ++i) {
        this.points[i] = this.lastInputtedVal;
      }
    } else {
      this.refillTimelineWithPattern();
    }
  }

  private refillTimelineWithPattern() {
    const wholeHeadTime = this.headTime - this.subtimeOffset;
    for (let i = 0; i < numPoints; ++i) {
      const timelinePos = i / numPoints;
      const time = wholeHeadTime + timelineLength * timelinePos;
      const val = this.patternVal(time);
      this.setValForPoint(i, val);
    }
  }

  private mounted() {
    // FIXME: adjust size of canvas to fit... something?
    const canvas = document.getElementById("canvas")! as HTMLCanvasElement;
    this.ctx = canvas.getContext("2d")!;
    this.ctx.fillStyle = "green";
    this.ctx.fillRect(10, 10, 100, 100);

    for (let i = 0; i < numPoints; ++i) {
      this.points.push(0);
    }

    this.SetPattern(this.curPattern);

    window.setInterval(() => { this.step(); }, 16);
  }

  private step() {
    this.doUpdate();
    this.doRender();
  }

  private doUpdate() {
    this.speed = this.speedSliderValue / 50;

    // FIXME: compute the actual time elapsed to be framerate independent
    // (potentially impossible due to Date.now() precision nerfs to mitigate spectre?)
    const trueTimeDelta = 16 / 1000;

    const timeDelta = trueTimeDelta * this.speed;
    // FIXME: reset to 0 sometimes to avoid overflow/precision issues?
    const newHeadTime = this.headTime + timeDelta;
    const newTailTime = newHeadTime + timelineLength;
    const wholeTailTime = this.headTime + timelineLength - this.subtimeOffset;

    // We need to add a point to the tail for every point the delta walks over
    for (let time = wholeTailTime + timePerPoint; time < newTailTime; time += timePerPoint) {
      // FIXME: this seems to have enough rounding error to produce a slight discontinuity
      // on the first point push from a fresh pattern; not a big deal but ugly.

      // circular buffer push_back
      const val = this.curPattern === -1 ? this.lastInputtedVal : this.patternVal(time);
      this.points[this.headOfPoints] = val;
      this.headOfPoints += 1;
      this.headOfPoints %= numPoints;
    }

    this.headTime = newHeadTime;
    this.subtimeOffset = this.headTime % timePerPoint;
    this.subposOffset = this.subtimeOffset / timelineLength;

    // FIXME: interpolate over the whole time range to get more accurate results for
    // extreme value changes at fast speeds?

    // Interpolate between the two points that straddle the curVal line
    const factor = this.subtimeOffset / timePerPoint;
    const valA = this.valForPoint(curValPoint);
    const valB = this.valForPoint(curValPoint + 1);
    this.curVal = valA * (1 - factor) + valB * factor;

    this.$emit("devicemessage", this.device, new SingleMotorVibrateCmd(this.curVal));

    // 10px overdraw to hide end of line (hack)
    this.width = this.ctx.canvas.width + 10;
    this.height = this.ctx.canvas.height;
    const rect = this.ctx.canvas.getBoundingClientRect();
    this.x = rect.left;
    this.y = rect.top;
  }

  private handleDrag(e: MouseEvent) {
    const x = e.clientX - this.x;
    const y = e.clientY - this.y;
    const scale = maxY - minY;

    const yFraction = Math.max(Math.min(y / this.height, maxY), minY);
    const val = 1 - (yFraction - minY) / scale;

    if (this.curPattern === -1) {
      // FIXME: interpolate old mouse position for a smoother fill
      const idx = Math.round(x / this.width * numPoints);
      this.lastInputtedVal = val;

      for (let i = idx; i < numPoints; ++i) {
        this.setValForPoint(i, val);
      }
    } else {
      // Adjust pattern power
      this.patternMaxVal = val;
      this.refillTimelineWithPattern();
    }
  }

  private doRender() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    this.ctx.lineWidth = 3;

    // boundary lines
    this.ctx.strokeStyle = "#b2399c";

    this.ctx.beginPath();
    this.ctx.moveTo(curValX * this.width, 0);
    this.ctx.lineTo(curValX * this.width, this.height);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(0, minY * this.height);
    this.ctx.lineTo(this.width, minY * this.height);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(0, maxY * this.height);
    this.ctx.lineTo(this.width, maxY * this.height);
    this.ctx.stroke();

    // input curve
    this.ctx.strokeStyle = "#631054";
    this.ctx.fillStyle = "#631054";

    const firstVal = this.valForPoint(0);
    this.ctx.beginPath();
    this.ctx.moveTo(this.pointToX(0), this.valToY(firstVal));

    for (let i = 1; i < numPoints; ++i) {
      const val = this.valForPoint(i);
      this.ctx.lineTo(this.pointToX(i), this.valToY(val));
    }

    this.ctx.stroke();

    // current value indicator
    const jiggle = (this.curVal * Math.random() / 100) - (this.curVal / 200);
    this.ctx.beginPath();
    this.ctx.arc((curValX + jiggle) * this.width, this.valToY(this.curVal),
                 this.height * vibeHeight / 2,
                 0,
                 2 * Math.PI,
                 false);
    this.ctx.fill();
  }

  private valForPoint(idx: number): number {
    const trueIdx = (this.headOfPoints + idx) % numPoints;
    return this.points[trueIdx];
  }

  private setValForPoint(idx: number, val: number) {
    const trueIdx = (this.headOfPoints + idx) % numPoints;
    this.points[trueIdx] = val;
  }

  private patternVal(time: number): number {
    const scale = this.patternMaxVal - this.patternMinVal;
    const pattern = patterns[this.curPattern];
    return pattern.valAt(time % pattern.duration) * scale + this.patternMinVal;
  }

  private valToY(val: number): number {
    const scale = maxY - minY;
    return ((1 - val) * scale + minY) * this.height;
  }

  private pointToX(idx: number): number {
    const timelinePos = idx / numPoints;
    return (timelinePos - this.subposOffset) * this.width;
  }
}
