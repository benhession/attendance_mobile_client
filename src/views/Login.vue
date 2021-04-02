<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Login</ion-title>
        </ion-toolbar>
      </ion-header>


        <ion-list>
          <ion-item>
            <ion-label color="primary" position="floating">Username</ion-label>
            <ion-input v-model="username" />
          </ion-item>

          <ion-item>
            <ion-label color="primary" position="floating">Password</ion-label>
            <ion-input v-model="password" type="password" />
          </ion-item>
        </ion-list>

      <ion-button @click="logInput()">Login</ion-button>

    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonItem, IonList, IonInput, IonLabel
} from "@ionic/vue";
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore, ACTIONS } from '@/store'

export default {
  // name: "Login",
  components: {
    IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButton, IonItem, IonList, IonInput, IonLabel
  },
  setup() {
    const router = useRouter();
    const store = useStore();

    const username = ref("");
    const password = ref("");

    function logInput() {
      console.log("Username:", username.value, "password:", password.value);

      store.dispatch(ACTIONS.LOG_IN).then( () => {
        console.log(store.getters.getLoggedIn);
        router.push({name: 'tab1'})}
      ).catch((error) => console.log(error));
    }

    return {router, store, username, password, logInput};
  }
};

</script>

<style scoped>

</style>