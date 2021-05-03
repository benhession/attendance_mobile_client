<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="primary">
          <ion-button color="primary" @click="logoutAlert">Logout</ion-button>
        </ion-buttons>
        <ion-title>Scan QR code</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :scroll-y="false" style="--ion-background-color: transparent">

      <div v-if="scanActive" class="scan-box-container">
        <ion-icon :icon="scan" class="scan-box"></ion-icon>
      </div>

      <div v-else-if="!permissionGranted" class="scan-box-container">
        <ion-button @click="presentOpenSettingsAlert()">Scan QR code</ion-button>
      </div>

    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonButton,
  IonButtons,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
  onIonViewDidEnter,
  onIonViewWillLeave
} from '@ionic/vue';
import {scan} from 'ionicons/icons';
import {useStore} from "@/store";
import {useRouter} from "vue-router";
import {presentLogoutAlertAndCallback} from "@/alerts/logoutAlert";
import {presentOpenSettingsAlert} from "@/alerts/qrPermissionAlerts";
import {Plugins} from "@capacitor/core";
import {CheckPermissionResult, SupportedFormat} from "@capacitor-community/barcode-scanner";
import {ref} from "vue";

export default {
  name: 'QRTab',
  components: {IonHeader, IonToolbar, IonTitle, IonPage, IonButtons, IonButton, IonIcon},
  setup() {

    // constants
    const store = useStore();
    const router = useRouter();

    // reactive refs
    const scanActive = ref(false);
    const permissionGranted = ref(true);

    function stopScan() {
      const {BarcodeScanner} = Plugins;
      scanActive.value = false;

      BarcodeScanner.showBackground();
      BarcodeScanner.stopScan();
    }

    async function startScan() {
      const {BarcodeScanner} = Plugins;

      await BarcodeScanner.hideBackground();
      scanActive.value = true;
      const result = await BarcodeScanner.startScan({targetedFormats: [SupportedFormat.QR_CODE]});

      if (result.hasContent) {
        console.log(result.content);
        stopScan();
      }
    }

    async function didUserGrantPermission(): Promise<boolean> {
      const {BarcodeScanner} = Plugins;

      // check if user has granted permission
      const status: CheckPermissionResult = await BarcodeScanner.checkPermission({force: false});

      if (status.granted) {
        // permission is granted
        return true;
      } else if (status.denied || status.restricted || status.unknown) {
        // permission isn't granted - show open settings button by setting reactive ref to false
        permissionGranted.value = false;
        return false;
      } else if (status.neverAsked) {
        // get permission from the system
        const statusRequest: CheckPermissionResult = await BarcodeScanner.checkPermission({force: true});
        // double bang as could return undefined
        const granted = !! statusRequest.granted;
        permissionGranted.value = granted;
        return granted;
        }
      return false;
      }

    onIonViewDidEnter(() => didUserGrantPermission()
        .then(bool => {
          if (bool) {
            startScan();
          }
        })
    );

    onIonViewWillLeave(() => stopScan());

    const logoutAlert = () => presentLogoutAlertAndCallback(store, router, () => stopScan());

    return {logoutAlert, scanActive, permissionGranted, scan, presentOpenSettingsAlert}
  }
}
</script>

<style>
  .scan-box {
    color: #EAFBF480;
    font-size: 45vh;
    margin: 0 auto;
  }

  .scan-box-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>

