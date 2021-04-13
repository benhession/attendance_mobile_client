<template>
  <ion-page>
    <ion-tabs>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="tab1" href="/tabs/ClassesTab">
          <ion-icon :icon="school"/>
          <ion-label>Classes</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="QRTab" href="/tabs/QRTab">
          <ion-icon :icon="qrCodeOutline"/>
          <ion-label>Scan QR Code</ion-label>
        </ion-tab-button>

      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script lang="ts">
import {IonIcon, IonLabel, IonPage, IonTabBar, IonTabButton, IonTabs} from '@ionic/vue';
import {qrCode, qrCodeOutline, school} from 'ionicons/icons';
import {ACTIONS, useStore} from "@/store";
import {useRouter} from "vue-router";

export default {
  name: 'Tabs',
  components: {IonLabel, IonTabs, IonTabBar, IonTabButton, IonIcon, IonPage},
  setup() {

    const store = useStore();
    const router = useRouter()

    // log out if logged in does not equal true
    const loggedInPromise: Promise<boolean> = store.getters.getLoggedIn;
    loggedInPromise.then(loggedIn => {
      if (!loggedIn) {
        store.dispatch(ACTIONS.LOG_OUT);
        router.push({name: 'login'});
      }
    }).catch(e => console.error(e));

    // log out if the refresh token is expired
    const refreshExpiryPromise = store.getters.getRefreshIsExpired;
    refreshExpiryPromise.then((isExpired: boolean) => {
      if (isExpired) {
        store.dispatch(ACTIONS.LOG_OUT);
        router.push({name: 'login'});
      }
    });

    return {
      qrCode,
      school,
      qrCodeOutline
    }
  }
}
</script>