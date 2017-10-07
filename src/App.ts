import { ButtplugClient, ButtplugMessage, Device as BPDevice, Log, ButtplugDeviceMessage, StopAllDevices,
         SingleMotorVibrateCmd} from "buttplug";
import Vue from "vue";
import "vue-awesome/icons/bars";
import { Component, Model } from "vue-property-decorator";
import * as ButtplugPanel from "vue-buttplug-material-component";
import VibrationComponent from "./components/VibrationComponent/VibrationComponent.vue";
import PositionComponent from "./components/PositionComponent/PositionComponent.vue";

@Component({
  components: {
    VibrationComponent,
    PositionComponent,
  },
})
export default class App extends Vue {
  private hasOpenedMenu: boolean = false;
  @Model()
  private devices: BPDevice[] = [];
  private vibratingDevices: BPDevice[] = [];
  private launchDevices: Map<number, BPDevice> = new Map<number, BPDevice>();
  private isDragging: boolean = false;

  private SideNavOpen() {
    if (this.isDragging) {
      return;
    }
    if (!this.hasOpenedMenu) {
      this.hasOpenedMenu = true;
    }
    (this.$refs.leftSideNav as any).open();
  }

  private SideNavClose() {
    if (this.isDragging) {
      return;
    }
    (this.$refs.leftSideNav as any).close();
  }

  private ToggleLeftSideNav() {
    if (!this.hasOpenedMenu) {
      this.hasOpenedMenu = true;
    }
    (this.$refs.leftSideNav as any).toggle();
  }

  private OnDeviceConnected(aDevice: BPDevice) {
    this.devices.push(aDevice);
  }

  private OnDeviceDisconnected(aDevice: BPDevice) {
    this.devices = this.devices.filter((device) => device.Index !== aDevice.Index);
  }

  private async OnDeviceMessage(aDevice: BPDevice, aMessage: ButtplugDeviceMessage) {
    //await (this.$refs.buttplugPanel as ButtplugPanel.ButtplugPanelType).SendDeviceMessage(aDevice, aMessage);
  }

  private OnDragStart() {
    this.isDragging = true;
  }

  private OnDragStop() {
    this.isDragging = false;
  }
}
