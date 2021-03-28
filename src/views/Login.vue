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
import {IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonItem, IonList, IonInput, IonLabel} from "@ionic/vue";
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import router from "@/router";

export default defineComponent( {
  name: "Login",
  components: {  IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButton, IonItem, IonList, IonInput, IonLabel},
  setup() {
    const router = useRouter();
    return { router };
  },
  data() {
    return {
      username: "",
      password: "",
    }
  },
  methods: {
    logInput() {
      console.log("Username:", this.username, "password:", this.password);
      router.push({name: 'tab1'})
    }

  }
})
</script>

<style scoped>

</style>