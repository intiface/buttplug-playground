import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component
export default class ButtplugConnectionManager extends Vue {
  @Prop()
  private isConnected: boolean;
  private clientName: string = "Syncydink Video Player";
  private address: string = "ws://localhost:12345/buttplug";

  public mounted() {
    // This can easily be spoofed, but we're doing this for conveinence more
    // than security here.
    if (location.protocol === "https:") {
      this.address = "wss://localhost:12345/buttplug";
    }
  }
  private ConnectWebsocket() {
    this.$emit("connectwebsocket", {address: this.address,
                                    clientName: this.clientName});
  }
  private ConnectLocal() {
    this.$emit("connectlocal", {address: this.address,
                                clientName: this.clientName});
  }
  private Disconnect() {
    this.$emit("disconnect");
  }
}
