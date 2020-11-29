import { ButtplugClient, ButtplugClientDevice } from "buttplug-wasm";
import Vue from "vue";
import "vue-awesome/icons/bars";
import { Component } from "vue-property-decorator";
import VibrationComponent from "./components/VibrationComponent/VibrationComponent.vue";
import PositionComponent from "./components/PositionComponent/PositionComponent.vue";
import RotationComponent from "./components/RotationComponent/RotationComponent.vue";
import ComponentHelpText from "vue-buttplug-material-component/manual/manual.md";
import BpHelpText from "./manual/manual.md";
import TocHelpText from "./manual/toc.md";
const AppConfig = require("../dist/appconfig.json");

@Component({
  components: {
    VibrationComponent,
    PositionComponent,
    RotationComponent,
  },
})
export default class App extends Vue {
  private client!: ButtplugClient;
  private menuOpened: boolean = true;
  private devices: ButtplugClientDevice[] = [];
  private isDragging: boolean = false;
  private config: object = AppConfig;
  private helpText: string = TocHelpText + "\n" + ComponentHelpText + "\n" + BpHelpText;

  public async mounted() {
    await this.CreateNewClient();
  }

  private async CreateNewClient() {
    this.client = await ButtplugClient.connectEmbedded();
    this.client.addListener("disconnect", this.OnClientDisconnect);
  }

  private ToggleDialog() {
    this.menuOpened = !this.menuOpened;
  }

  private async OnClientDisconnect() {
    this.devices = [];
    this.client.removeListener("disconnect", this.OnClientDisconnect);
    await this.CreateNewClient();
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
}
