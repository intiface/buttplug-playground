import { ButtplugClient, ButtplugMessage, Device, Log, ButtplugDeviceMessage, StopAllDevices,
         SingleMotorVibrateCmd} from "buttplug";
import Vue from "vue";
import "vue-awesome/icons/bars";
import { Component, Model } from "vue-property-decorator";
import ButtplugPanelComponent from "./components/ButtplugPanel/ButtplugPanel.vue";
import ButtplugPanel from "./components/ButtplugPanel/ButtplugPanel";
import VibrationComponent from "./components/VibrationComponent/VibrationComponent.vue";

@Component({
  components: {
    ButtplugPanelComponent,
    VibrationComponent,
  },
})
export default class App extends Vue {
  private hasOpenedMenu: boolean = false;
  @Model()
  private devices: Map<number, Device> = new Map<number, Device>();
  private vibratingDevices: Device[] = [];
  private launchDevices: Map<number, Device> = new Map<number, Device>();

  private SideNavOpen() {
    if (!this.hasOpenedMenu) {
      (this.$refs.swipeStartText as any).remove();
      this.hasOpenedMenu = true;
    }
    (this.$refs.leftSideNav as any).open();
  }

  private SideNavClose() {
    (this.$refs.leftSideNav as any).close();
  }

  private ToggleLeftSideNav() {
    if (!this.hasOpenedMenu) {
      (this.$refs.swipeStartText as any).remove();
      this.hasOpenedMenu = true;
    }
    (this.$refs.leftSideNav as any).toggle();
  }

  private OnDeviceConnected(aDevice: Device) {
    this.devices.set(aDevice.Index, aDevice);
    if (aDevice.AllowedMessages.indexOf("SingleMotorVibrateCmd") !== -1) {
      this.vibratingDevices.push(aDevice);
    }
  }

  private OnDeviceDisconnected(aDevice: Device) {
    this.devices.delete(aDevice.Index);
  }

  private async OnVibrateChange(aDevice: Device, aPower: number) {
    await (this.$refs.buttplugPanel as ButtplugPanel).SendDeviceMessage(aDevice,
                                                                        new SingleMotorVibrateCmd(aPower / 100.0));
  }
}
