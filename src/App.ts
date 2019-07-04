import { ButtplugClient, ButtplugClientDevice, Log, ButtplugDeviceMessage } from "buttplug";
import Vue from "vue";
import "vue-awesome/icons/bars";
import { Component, Model } from "vue-property-decorator";
import VibrationComponent from "./components/VibrationComponent/VibrationComponent.vue";
import PositionComponent from "./components/PositionComponent/PositionComponent.vue";
import RotationComponent from "./components/RotationComponent/RotationComponent.vue";
import ButtplugPanel from "vue-buttplug-material-component/src/ButtplugPanel.vue";
import HelpText from "./help.md";
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
  private helpText: string = HelpText;

  private ToggleDialog() {
    this.menuOpened = !this.menuOpened;
  }

  private OnClientDisconnect() {
    this.devices = [];
  }

  private OnSelectedDevicesChange(aDeviceList: ButtplugClientDevice[]) {
    this.devices = aDeviceList;
  }

  private async OnDeviceMessage(aDevice: ButtplugClientDevice, aMessage: ButtplugDeviceMessage) {
    (Vue as any).Buttplug.SendDeviceMessage(aDevice, aMessage);
  }

  private OnDragStart() {
    this.isDragging = true;
  }

  private OnDragStop() {
    this.isDragging = false;
  }
}
