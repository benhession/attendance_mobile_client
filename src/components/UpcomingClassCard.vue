<template>

    <ion-card style="padding-left: 1em" color="light">
      <ion-card-header class="ion-float-right">{{ theClass.datetime.format('MMMM Do YYYY, h:mm a') }}</ion-card-header>
      <ion-card-subtitle style="padding-top: 4.5em; width: 100%" >{{ theClass.module.moduleCode }} | {{ theClass.module.moduleName }}</ion-card-subtitle>
      <ion-card-title>{{ theClass.name }}</ion-card-title>
      <ion-card-content>
        <p><b>Class type:</b> {{ theClass.classType }}</p>
        <p><b>Tutor:</b> {{ theClass.tutor.forename }} {{ theClass.tutor.surname }}</p>
        <p><b>Location:</b> {{ theClass.location }}</p>
      </ion-card-content>

    </ion-card>

</template>

<script lang="ts">
import {StudentUniversityClass} from "@/model/StudentUniversityClass";
import {IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle} from '@ionic/vue';

export default {
  name: "UpcomingClassCard",
  props: {
    theClass: StudentUniversityClass
  },
  components: {
    IonCard, IonCardHeader, IonCardSubtitle, IonCardContent, IonCardTitle
  }

}
</script>

<style scoped>

</style>