<template>
  <IonItem @click="openPreviousModal(theClass)" detail="true">
    <ion-label>
      <h2>{{ theClass.name }}</h2>
      <h3>{{ theClass.datetime.format('MMMM Do YYYY, h:mm a') }}</h3>
    </ion-label>

    <ion-chip v-if="theClass.attended" color="success" slot="end">
      <ion-label color="success">Attended</ion-label>
    </ion-chip>
    <ion-chip v-else color="danger" class="ion-float-right" slot="end">
      <ion-label color="danger">Absent</ion-label>
    </ion-chip>

  </IonItem>
</template>

<script lang="ts">
import {StudentUniversityClass} from "@/model/StudentUniversityClass";
import {IonItem, IonLabel, IonChip, modalController} from '@ionic/vue';
import PreviousClassModal from "@/components/PreviousClassModal.vue";

export default {
  name: "PreviousClassItem",
  props: {
    theClass: StudentUniversityClass
  },
  setup() {

    async function openPreviousModal(aClass: StudentUniversityClass) {
      const modal = await modalController.create({
        component: PreviousClassModal,
        componentProps: {
          theClass: aClass
        }
      })
      return modal.present();
    }

    return { IonItem, IonLabel, IonChip, openPreviousModal }
  }
}
</script>
