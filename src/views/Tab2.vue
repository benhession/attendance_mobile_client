<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="primary">
          <ion-button color="primary" @click="logoutAlert">Logout</ion-button>
        </ion-buttons>
        <ion-title>Tab 2</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 2</ion-title>
        </ion-toolbar>
      </ion-header>
      <ExploreContainer name="Tab 2 page" />
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton} from '@ionic/vue';
import ExploreContainer from '@/components/ExploreContainer.vue';
import {useStore} from "@/store";
import {useRouter} from "vue-router";
import {presentLogoutAlert} from "@/alerts/logoutAlert";

export default  {
  name: 'Tab2',
  components: { ExploreContainer, IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButtons, IonButton },
  setup() {

    const store = useStore();
    const router = useRouter();

    const logoutAlert = () => presentLogoutAlert(store, router);

    return {logoutAlert}
  }
}
</script>