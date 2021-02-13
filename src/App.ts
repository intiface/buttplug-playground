import { ButtplugClient, ButtplugClientDevice, ButtplugDeviceMessageType } from "buttplug";
import Vue from "vue";
import "vue-awesome/icons/bars";
import { Component } from "vue-property-decorator";
import VibrationComponent from "./components/VibrationComponent/VibrationComponent.vue";
import PositionComponent from "./components/PositionComponent/PositionComponent.vue";
import RotationComponent from "./components/RotationComponent/RotationComponent.vue";
import ButtplugPanel from "./components/ButtplugPanel/ButtplugPanel.vue";
// import ComponentHelpText from "./components/ButtplugPanel/manual/manual.md";
// import BpHelpText from "./components/ButtplugPanel/manual/manual.md";
// import TocHelpText from "./components/ButtplugPanel/manual/toc.md";
const AppConfig = require("../dist/appconfig.json");

@Component({
  components: {
    VibrationComponent,
    PositionComponent,
    RotationComponent,
    ButtplugPanel,
  },
})
export default class App extends Vue {
  private client: ButtplugClient = new ButtplugClient("Buttplug Playground");
  private menuOpened: boolean = true;
  private devices: ButtplugClientDevice[] = [];
  private isDragging: boolean = false;
  private config: object = AppConfig;
  private helpText: string = "help"; //TocHelpText + "\n" + ComponentHelpText + "\n" + BpHelpText;

  public async mounted() {
    this.client.addListener("disconnect", this.OnClientDisconnect);
  }

  private ToggleDialog() {
    this.menuOpened = !this.menuOpened;
  }

  private async OnClientDisconnect() {
    this.devices = [];
    this.client.removeListener("disconnect", this.OnClientDisconnect);
    this.client = new ButtplugClient("Buttplug Playground");
    this.client.addListener("disconnect", this.OnClientDisconnect);
  }

  private OnSelectedDevicesChange(aDeviceList: ButtplugClientDevice[]) {
    this.devices = aDeviceList;
    if (this.devices.length > 0) {
      console.log(this.devices[0]);
    }
  }

  private OnDragStart() {
    this.isDragging = true;
  }

  private OnDragStop() {
    this.isDragging = false;
  }

  private canVibrate(device: ButtplugClientDevice): boolean {
    return device.messageAttributes(ButtplugDeviceMessageType.VibrateCmd) !== undefined;
  }

  private canRotate(device: ButtplugClientDevice): boolean {
    return device.messageAttributes(ButtplugDeviceMessageType.RotateCmd) !== undefined;
  }

  private canLinear(device: ButtplugClientDevice): boolean {
    return device.messageAttributes(ButtplugDeviceMessageType.LinearCmd) !== undefined;
  }

  private numVibrators(device: ButtplugClientDevice): number {
    if (device || !device.messageAttributes(ButtplugDeviceMessageType.VibrateCmd) || !device.messageAttributes(ButtplugDeviceMessageType.VibrateCmd).featureCount) {
      return 0;
    }
    return device!.messageAttributes(ButtplugDeviceMessageType.VibrateCmd)!.featureCount!;
  }
}
