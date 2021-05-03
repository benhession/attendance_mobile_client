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
    <ion-content class="transparent" :fullscreen="true">
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonButton,
  IonButtons,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  onIonViewDidEnter,
  onIonViewWillLeave
} from '@ionic/vue';
import {useStore} from "@/store";
import {useRouter} from "vue-router";
import {presentLogoutAlertAndCallback} from "@/alerts/logoutAlert";
import {presentPermissionConfirmation} from "@/alerts/qrPermissionAlerts";
import {Plugins} from "@capacitor/core";
import {CheckPermissionResult, SupportedFormat} from "@capacitor-community/barcode-scanner";

export default {
  name: 'QRTab',
  components: {IonHeader, IonToolbar, IonTitle, IonPage, IonButtons, IonButton},
  setup() {

    const store = useStore();
    const router = useRouter();

    async function startScan() {
      const {BarcodeScanner} = Plugins;

      await BarcodeScanner.hideBackground();
      const result = await BarcodeScanner.startScan({targetedFormats: [SupportedFormat.QR_CODE]});

      if (result.hasContent) {
        console.log(result.content);
      }
    }

    function stopScan() {
      const {BarcodeScanner} = Plugins;
      BarcodeScanner.showBackground();
      BarcodeScanner.stopScan();
    }

    async function didUserGrantPermission(): Promise<boolean> {
      const {BarcodeScanner} = Plugins;
      // prepare scanner
      await BarcodeScanner.prepare();
      // check if user has granted permission
      const status: CheckPermissionResult = await BarcodeScanner.checkPermission({force: false});

      if (status.granted) {
        return true;
      } else if (status.denied || status.restricted || status.unknown) {
        return false;
        // TODO: Allow user to open settings if permission is denied (put option in webview)
      } else if (status.neverAsked) {
        const confirm = await presentPermissionConfirmation();
        if (!confirm) {
          // user denied permission
          return false;
        }
      }
      // get permission from the system
      const statusRequest: CheckPermissionResult = await BarcodeScanner.checkPermission({force: true});
      return !!statusRequest.granted;


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

    return {logoutAlert}
  }
}
</script>
<style scoped>

  .transparent {
    --ion-background-color: #00000000;
  }

</style>
