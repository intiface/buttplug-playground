import { Device } from "buttplug";
import Vue from "vue";
import { Component, Model, Prop, Watch } from "vue-property-decorator";

@Component
export default class ButtplugDeviceManager extends Vue {
  @Prop()
  private devices: Device[];

  @Prop()
  private isConnected: boolean;

  @Model()
  private scanningText: string = "Start Scanning";

  private selectedDevices: Device[] = [];
  private isScanning: boolean = false;
  private boxChecked: boolean = false;

  @Watch("isConnected")
  private onConnectionChange() {
    if (this.isConnected) {
      return;
    }
    this.isScanning = false;
    this.scanningText = "Start Scanning";
  }

  private ScanningClicked(ev: Event) {
    if (!this.isScanning) {
      this.$emit("startScanning");
      this.isScanning = true;
      this.scanningText = "Stop Scanning";
      return;
    }
    this.$emit("stopScanning");
    this.isScanning = false;
    this.scanningText = "Start Scanning";
  }

  private onCheckboxChange(aChecked: boolean, aDeviceId: number) {
    if (aChecked) {
      for (const device of this.devices) {
        if (device.Index === aDeviceId &&
            this.selectedDevices.indexOf(device) === -1) {
          this.selectedDevices.push(device);
          break;
        }
      }
    } else {
      this.selectedDevices = this.selectedDevices.filter((d) => {
        return d.Index !== aDeviceId;
      });
    }
    this.$emit("selectedDevicesChanged", this.selectedDevices);
  }
}
