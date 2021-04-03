<template>
  <ion-page>
    <ion-tabs>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="tab1" href="/tabs/tab1">
          <ion-icon :icon="school"/>
          <ion-label>Classes</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab2" href="/tabs/tab2">
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
import {MUTATIONS, useStore} from "@/store";
import {useRouter} from "vue-router";

export default {
  name: 'Tabs',
  components: {IonLabel, IonTabs, IonTabBar, IonTabButton, IonIcon, IonPage},
  setup() {

    const store = useStore();
    const router = useRouter()

    const loggedInPromise: Promise<boolean> = store.getters.getLoggedIn
    loggedInPromise.then(loggedIn => {
      if (!loggedIn) {
        store.commit(MUTATIONS.CLEAR_TOKENS);
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