<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" :scroll-y="false">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Login</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-loading :is-open="loading" message="Please wait ..."></ion-loading>

      <div class="login-form-container">
        <div class="login-form">
          <ion-list>
            <ion-item>
              <ion-label color="primary" position="floating">Username</ion-label>
              <ion-input v-model="username"/>
            </ion-item>

            <ion-item>
              <ion-label color="primary" position="floating">Password</ion-label>
              <ion-input v-model="password" type="password" enterkeyhint="go" @keyup.enter="logIn()"/>
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
  IonToolbar,
  IonLoading
} from "@ionic/vue";
import {ref} from 'vue';

import {ACTIONS, useStore} from '@/store'
import {useRouter} from "vue-router";
import {presentMessageAlert} from "@/alerts/messageAlert";

export default {
  name: "Login",
  components: {
    IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButton, IonItem, IonList, IonInput, IonLabel, IonLoading
  },
  setup() {

    // constants
    const router = useRouter()
    const store = useStore();
    const messageAlert = (header: string, message: string) => presentMessageAlert(header, message);

    // reactive references
    const username = ref("");
    const password = ref("");
    const loading = ref(false);

    // functions

    // login and get auth tokens, handle errors gracefully
    function logIn() {
      loading.value = true;
      store.dispatch(ACTIONS.LOG_IN, [username.value, password.value])
          .then(() => {
            loading.value = false;
            router.push({name: 'ClassesTab'})
          })
          .catch((e) => {
            loading.value = false;
            if (e instanceof Error) {
              if (e.message === 'Request failed with status code 401') {
                messageAlert('Login failed', 'Please provide a valid username and password');
              } else {
                messageAlert(e.name, e.message);
              }
            }
          });
    }

    // logic

    // if logged in fetch classes and push to classesTab.vue
    loading.value = true;
    const loggedInPromise: Promise<boolean> = store.getters.getLoggedIn
    loggedInPromise.then((loggedIn) => {
      if (loggedIn) {
        store.dispatch(ACTIONS.FETCH_STUDENT_CLASSES).then(() => {
          loading.value = false;
          router.push({name: 'ClassesTab'})
        }).catch((e: Error) => {
          loading.value = false;
          store.dispatch(ACTIONS.LOG_OUT);
          messageAlert("Error", "Unable to login: ".concat(e.message))
        });
      } else {
        loading.value = false;
      }
    }).catch(reason => console.error(reason));

    return {router, store, username, password, logIn, loading};
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