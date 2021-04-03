<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { defineComponent } from 'vue';
import { useStore } from "@/store";
import { UserDefaults } from "@/services/UserDefaults";

export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet
  },
  setup(){
    const store = useStore();
    const userDefaults = UserDefaults.getInstance();

    return {store, userDefaults}
  }
});
</script>