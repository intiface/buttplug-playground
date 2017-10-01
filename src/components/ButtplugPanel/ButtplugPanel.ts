import { ButtplugClient, ButtplugWebsocketClient, ButtplugBrowserClient, ButtplugMessage,
         ButtplugDeviceMessage, Device, Log, StopDeviceCmd } from "buttplug";
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import ButtplugConnectionManagerComponent from "../ButtplugConnectionManager/ButtplugConnectionManager.vue";
import ButtplugStartConnectEvent from "../ButtplugConnectionManager/ButtplugStartConnectEvent";
import ButtplugDeviceManagerComponent from "../ButtplugDeviceManager/ButtplugDeviceManager.vue";
import ButtplugLogManagerComponent from "../ButtplugLogManager/ButtplugLogManager.vue";

@Component({
  components: {
    ButtplugConnectionManagerComponent,
    ButtplugDeviceManagerComponent,
    ButtplugLogManagerComponent,
  },
})
export default class ButtplugPanel extends Vue {
  private logMessages: string[] = [];
  private devices: Device[] = [];
  private selectedDevices: Device[] = [];
  private isConnected: boolean = false;

  private buttplugClient: ButtplugClient | null = null;

  public async StopAllDevices() {
    if (this.buttplugClient === null) {
      return;
    }
    await this.buttplugClient.StopAllDevices();
  }

  public async SendDeviceMessage(aDevice: Device, aMsg: ButtplugDeviceMessage) {
    if (this.buttplugClient === null) {
      return;
    }
    if (!this.deviceSelected(aDevice)) {
      return;
    }
    if (aDevice.AllowedMessages.indexOf(aMsg.getType()) === -1) {
      return;
    }
    await this.buttplugClient.SendDeviceMessage(aDevice, aMsg);
  }

  public async ConnectWebsocket(aConnectObj: ButtplugStartConnectEvent) {
    const buttplugClient = new ButtplugWebsocketClient(aConnectObj.clientName);
    await buttplugClient.Connect(aConnectObj.address);
    await this.InitializeConnection(buttplugClient);
  }

  public async ConnectLocal(aConnectObj: ButtplugStartConnectEvent) {
    const buttplugClient = new ButtplugBrowserClient(aConnectObj.clientName);
    await buttplugClient.Connect(aConnectObj.address);
    await this.InitializeConnection(buttplugClient);
  }

  public Disconnect() {
    this.isConnected = false;
    this.devices = [];
    this.selectedDevices = [];
    if (this.buttplugClient === null) {
      return;
    }
    if (this.buttplugClient.Connected) {
      this.buttplugClient.Disconnect();
    }
    this.buttplugClient = null;
  }

  public async SetLogLevel(logLevel: string) {
    if (this.buttplugClient === null) {
      return;
    }
    await this.buttplugClient.RequestLog(logLevel);
  }

  public async StartScanning() {
    if (this.buttplugClient === null) {
      return;
    }
    await this.buttplugClient.StartScanning();
  }

  public async StopScanning() {
    if (this.buttplugClient === null) {
      return;
    }
    await this.buttplugClient.StopScanning();
  }

  private deviceSelected(aDevice: Device): boolean {
    return this.selectedDevices.find((device) => aDevice.Index === device.Index) !== undefined;
  }

  private async InitializeConnection(aButtplugClient: ButtplugClient) {
    aButtplugClient.addListener("close", this.Disconnect);
    aButtplugClient.addListener("log", this.AddLogMessage);
    aButtplugClient.addListener("deviceadded", this.AddDevice);
    aButtplugClient.addListener("deviceremoved", this.RemoveDevice);
    this.isConnected = true;
    const devices = await aButtplugClient.RequestDeviceList();
    this.buttplugClient = aButtplugClient;
  }

  private AddLogMessage(logMessage: Log) {
    this.logMessages.push(logMessage.LogMessage);
  }

  private DeviceAlreadyAdded(device: Device): boolean {
    return this.devices.filter((d) => device.Index === d.Index).length !== 0;
  }

  private AddDevice(device: Device) {
    if (!this.DeviceAlreadyAdded(device)) {
      this.devices.push(device);
    }
  }

  private RemoveDevice(device: Device) {
    if (this.devices.indexOf(device) !== -1) {
      this.devices.splice(this.devices.indexOf(device), 1);
    }
  }

  private OnSelectedDevicesChanged(aDeviceList: Device[]) {
    const newSelectedDevices: Device[] = [];
    for (const aDevice of this.selectedDevices) {
      if (aDeviceList.find((device) => aDevice.Index === device.Index) !== undefined ||
          this.buttplugClient === null) {
        newSelectedDevices.push(aDevice);
        continue;
      }
      this.$emit("devicedisconnected", aDevice);
      // If a device is removed from selected devices, send a stop command to it.
      this.buttplugClient.SendDeviceMessage(aDevice, new StopDeviceCmd()).catch((e) => console.log(e));
    }

    aDeviceList.map((aDevice) => {
      if (this.deviceSelected(aDevice)) {
        return;
      }
      newSelectedDevices.push(aDevice);
      this.$emit("deviceconnected", aDevice);
    });
    this.selectedDevices = newSelectedDevices;
  }
}
