<template>

  <ion-card style="padding-left: 1em" color="light">
    <ion-card-header class="ion-float-right">{{ theClass.datetime.format('MMMM Do YYYY, h:mm a') }}</ion-card-header>
    <ion-card-subtitle style="padding-top: 4.5em; width: 100%">{{ theClass.module.moduleCode }} |
      {{ theClass.module.moduleName }}
    </ion-card-subtitle>
    <ion-card-title>{{ theClass.name }}</ion-card-title>
    <ion-card-content>
      <p>Class type: {{ theClass.classType }}</p>
      <p>Tutor: {{ theClass.tutor.forename }} {{ theClass.tutor.surname }}</p>
    </ion-card-content>

    <ion-chip v-if="theClass.attended" color="success" class="ion-float-right">
      <ion-label color="success">Attended</ion-label>
    </ion-chip>
    <ion-chip v-else disabled color="danger" class="ion-float-right">
      <ion-label color="danger">Absent</ion-label>
    </ion-chip>

  </ion-card>

</template>

<script lang="ts">
import {StudentUniversityClass} from "@/model/StudentUniversityClass";
import {IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonChip} from '@ionic/vue';

export default {
  name: "PreviousClassCard",
  props: {
    theClass: StudentUniversityClass
  },
  components: {
    IonCard, IonCardHeader, IonCardSubtitle, IonCardContent, IonCardTitle, IonChip
  }

}
</script>

<style scoped>

</style>