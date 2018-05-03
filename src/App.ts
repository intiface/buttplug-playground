import { ButtplugClient, ButtplugMessage, Device, Log, ButtplugDeviceMessage, StopAllDevices,
         SingleMotorVibrateCmd } from "buttplug";
import Vue from "vue";
import "vue-awesome/icons/bars";
import { Component, Model } from "vue-property-decorator";
import VibrationComponent from "./components/VibrationComponent/VibrationComponent.vue";
import PositionComponent from "./components/PositionComponent/PositionComponent.vue";
import RotationComponent from "./components/RotationComponent/RotationComponent.vue";
const AppConfig = require("../dist/appconfig.json");

@Component({
  components: {
    VibrationComponent,
    PositionComponent,
    RotationComponent,
  },
})
export default class App extends Vue {
  private hasOpenedMenu: boolean = false;
  private menuOpened: boolean = false;
  private devices: Device[] = [];
  private vibratingDevices: Device[] = [];
  private launchDevices: Map<number, Device> = new Map<number, Device>();
  private isDragging: boolean = false;
  private config: object = AppConfig;

  private SideNavOpen() {
    if (this.isDragging) {
      return;
    }
    if (!this.hasOpenedMenu) {
      this.hasOpenedMenu = true;
    }
    this.menuOpened = true;
  }

  private SideNavClose() {
    if (this.isDragging) {
      return;
    }
    this.menuOpened = false;
  }

  private ToggleLeftSideNav() {
    if (!this.hasOpenedMenu) {
      this.hasOpenedMenu = true;
    }
    this.menuOpened = !this.menuOpened;
  }

  private OnDeviceConnected(aDevice: Device) {
    this.devices.push(aDevice);
  }

  private OnDeviceDisconnected(aDevice: Device) {
    this.devices = this.devices.filter((device) => device.Index !== aDevice.Index);
  }

  private async OnDeviceMessage(aDevice: Device, aMessage: ButtplugDeviceMessage) {
    (Vue as any).Buttplug.SendDeviceMessage(aDevice, aMessage);
  }

  private OnDragStart() {
    this.isDragging = true;
  }

  private OnDragStop() {
    this.isDragging = false;
  }
}
