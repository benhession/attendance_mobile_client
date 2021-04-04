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

      <div class="login-form-container">
        <div class="login-form">
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

          <ion-button class="login-btn" @click="logIn()">Login</ion-button>
        </div>
      </div>
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
import {presentMessageAlert} from "@/alerts/messageAlert";

export default {
  name: "Login",
  components: {
    IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButton, IonItem, IonList, IonInput, IonLabel
  },
  setup() {
    const router = useRouter()
    const store = useStore();

    const messageAlert = (header: string, message: string) => presentMessageAlert(store, router, header, message);

    const username = ref("");
    const password = ref("");

    // if logged in push to tab1 view
    const loggedInPromise: Promise<boolean> = store.getters.getLoggedIn
    loggedInPromise.then((loggedIn) => {
      if (loggedIn) {
        router.push({name: 'tab1'})
      }
    }).catch(reason => console.error(reason));

    // login and get auth tokens, handle errors gracefully
    function logIn() {
      store.dispatch(ACTIONS.LOG_IN, [username.value, password.value])
          .then(() => {
            router.push({name: 'tab1'})
          })
          .catch((e) => {
            if (e instanceof Error) {
              console.error(e);
              if (e.message === 'Network Error') {
                messageAlert('Network Error', 'Unable to connect to authorisation server');
              } else if (e.message === 'Request failed with status code 401') {
                messageAlert('Login failed', 'Please provide a valid username and password');
              } else {
                messageAlert('Unknown error', 'see console for details');
              }
            }
          });
    }

    return {router, store, username, password, logIn};
  }
}

</script>

<style scoped>
.login-form-container {
  height: 60%;
  width: 100%;
  padding-right: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-form {
  width: 100%;
}

.login-btn {
  margin-top: 50px;
  width: 100%;
}

</style>