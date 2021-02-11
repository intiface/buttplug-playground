<template>
  <v-container>
    <div v-if="!Connected">
      <v-btn
        color="red lighten-2"
        @click="ConnectToIntifaceDesktop"
        class="white--text"
        :disabled="isConnecting"
      >
        Connect To Intiface Desktop
      </v-btn>
      <v-btn
        color="red lighten-2"
        @click="ConnectInBrowser"
        :disabled="!HasWebBluetooth"
        class="white--text"
      >
        {{ HasWebBluetooth ? "Connect In Browser" : "Requires WebBluetooth" }}
      </v-btn>
      <v-card elevation="3" class="message-card" v-if="uiMessage">
        <v-layout row>
          <v-flex shrink>
            <v-btn icon @click="CloseUiMessage">
              <v-icon>close</v-icon>
            </v-btn>
          </v-flex>
          <v-flex class="message-flex">
            <span class="error-text" v-if="uiMessage && uiMessage[0] === 0">Error:</span>
            {{ uiMessage[1] }}
          </v-flex>
        </v-layout>
      </v-card>
      <v-card v-if="isConnecting">
        <v-layout row>
          <v-flex shrink>
            <v-progress-circular
              indeterminate
              color="purple"
            ></v-progress-circular><span>Trying to connect to Intiface Desktop...</span>
          </v-flex>
        </v-layout>
      </v-card>
      <v-expansion-panel v-if="!isConnecting">
        <v-expansion-panel-content>
          <template v-slot:header>
            Advanced Settings
          </template>
          <v-container>
            <v-checkbox
              v-model="scanOnConnect"
              label="Start Scanning On Connect">
            </v-checkbox>
            <v-divider />
            <v-subheader>
              Websocket Addresses
            </v-subheader>
            <v-layout
              v-for="address in desktopAddresses"
              :class="address.IsValidURL ? 'address-line-correct address-line' : 'address-line-incorrect address-line'"
              :key="address.Id"
            >
              <v-flex class="address-entry">
                <v-text-field
                  label="Host"
                  v-model="address.Host"
                  @change="StoreAddressCookie()"
                ></v-text-field>
              </v-flex>
              <v-flex class="address-entry">
                <v-text-field
                  label="Port"
                  mask="#####"
                  v-model="address.Port"
                  @change="StoreAddressCookie()"
                ></v-text-field>
              </v-flex>
              <v-flex>
                <v-checkbox
                  v-model="address.Insecure"
                  @change="StoreAddressCookie()"
                  label="Insecure">
                </v-checkbox>
              </v-flex>
              <v-flex>
                <v-checkbox
                  v-model="address.Secure"
                  @change="StoreAddressCookie()"
                  label="Secure">
                </v-checkbox>
              </v-flex>
              <v-flex shrink>
                <v-btn
                  @click="RemoveAddress(address.Id)">
                  <v-icon>close</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
            <v-btn
              @click="AddAddress()">
              <v-icon>add</v-icon>
            </v-btn>
            <v-btn
              @click="ResetAddresses()">
              Reset
            </v-btn>
          </v-container>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </div>
    <div v-if="Connected">
      <v-btn
        color="red lighten-2"
        dark
        @click="Disconnect"
      >
        Disconnect
      </v-btn>
      <v-btn
        color="red lighten-2"
        dark
        @click="ToggleScanning"
      >
        {{ isScanning ? "Stop Scanning" : "Start Scanning" }}
      </v-btn>
      <v-subheader>
        Device List
      </v-subheader>
      <div v-if="clientDevices.length === 0">No Devices Available</div>
      <v-checkbox
        v-for="device in clientDevices"
        v-model="selectedDevices"
        @change="FireChange"
        :key="device.Index"
        :value="device.Index"
        :label="device.Name"></v-checkbox>
    </div>
  </v-container>
</template>

<script lang="ts" src="./ButtplugPanel.ts">
</script>

<style lang="css">
 .address-entry {
   padding-left: 5px;
   padding-right: 5px;
 }

 @media screen and (max-width: 640px) {
   .address-line {
     flex-direction: column;
   }
 }

 .address-line-correct {
   background: #ffffff;
 }

 .address-line-incorrect {
   background: #ffeeee;
 }

 .message-card {
   padding: 10px;
   margin-top: 10px;
   margin-bottom: 10px;
 }

 .error-text {
   color: #F00;
 }

 .message-flex {
   padding: 5px;
 }
</style>
