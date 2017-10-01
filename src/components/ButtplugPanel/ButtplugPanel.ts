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
      console.log("no client!");
      return;
    }
    if (this.selectedDevices.find((device) => aDevice.Index === device.Index) === undefined) {
      console.log(aDevice);
      console.log("no device!");
      return;
    }
    if (aDevice.AllowedMessages.indexOf(aMsg.getType()) === -1) {
      console.log("no message!");
      return;
    }
    console.log("Sending message?");
    console.log(aDevice);
    console.log(aMsg);
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
    // If a device is removed from selected devices, send a stop command to it.
    for (const aDevice of aDeviceList) {
      if (this.selectedDevices.indexOf(aDevice) === -1) {
        this.$emit("deviceconnected", aDevice);
      }
    }
    for (const aDevice of this.selectedDevices) {
      if (aDeviceList.indexOf(aDevice) !== -1 || this.buttplugClient === null) {
        continue;
      }
      this.buttplugClient.SendDeviceMessage(aDevice, new StopDeviceCmd()).catch((e) => console.log(e));
      this.$emit("devicedisconnected", aDevice);
    }
    this.selectedDevices = aDeviceList;
  }
}
