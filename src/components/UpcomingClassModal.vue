<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="primary">
        <ion-button color="primary" @click="close">Close</ion-button>
      </ion-buttons>
      <ion-title>{{ theClass.name }}</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding" :scroll-y="false">
    <p><b>Module:</b> {{ theClass.module.moduleCode.concat(': ').concat(theClass.module.moduleName) }}</p>
    <p><b>Date:</b> {{ theClass.datetime.format('MMMM Do YYYY') }}</p>
    <p><b>Time:</b> {{ theClass.datetime.format('h:mm a') }}</p>
    <p><b>Location:</b> {{ theClass.location }}</p>
    <p><b>Tutor:</b> {{ theClass.tutor.forename.concat(' ').concat(theClass.tutor.surname) }}</p>

    <ion-chip v-if="theClass.isInProgress()">
      <ion-label>In Progress</ion-label>
    </ion-chip>

  </ion-content>
</template>

<script lang="ts">
import {StudentUniversityClass} from "@/model/StudentUniversityClass";
import {IonHeader, IonToolbar, IonTitle, IonContent, modalController} from '@ionic/vue'
import {defineComponent} from "vue";

export default defineComponent({
  name: "UpcomingClassModal",
  props: {
    theClass: StudentUniversityClass,
  },
  setup() {

    function close() {
      modalController.dismiss();
    }

    return { IonHeader, IonToolbar, IonTitle, IonContent, close }
  }
});
</script>