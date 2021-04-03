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
          <ion-input v-model="username"/>
        </ion-item>

        <ion-item>
          <ion-label color="primary" position="floating">Password</ion-label>
          <ion-input v-model="password" type="password"/>
        </ion-item>
      </ion-list>

      <ion-button @click="logIn()">Login</ion-button>

    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar
} from "@ionic/vue";
import {ref} from 'vue';

import {ACTIONS, useStore} from '@/store'
import {useRouter} from "vue-router";

export default {
  name: "Login",
  components: {
    IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButton, IonItem, IonList, IonInput, IonLabel
  },
  setup() {
    const router = useRouter()
    const store = useStore();

    const username = ref("");
    const password = ref("");

    const loggedInPromise: Promise<boolean> = store.getters.getLoggedIn
    loggedInPromise.then((loggedIn) => {
      if (loggedIn) {
        router.push({name: 'tab1'})
      }
    });

    function logIn() {
      store.dispatch(ACTIONS.LOG_IN, [username.value, password.value])
          .then(() => {
            console.log(store.getters.getLoggedIn);
            router.push({name: 'tab1'})
          })
          .catch((error) => console.log(error));
    }

    return {router, store, username, password, logIn};
  }
}
;

</script>

<style scoped>

</style>