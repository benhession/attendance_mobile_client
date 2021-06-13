<template>
  <IonItem @click="openUpcomingModal(theClass)" detail="true">
    <ion-label>
      <h2>{{ theClass.name }}</h2>
      <h3>{{ theClass.datetime.format('MMMM Do YYYY, h:mm a') }}</h3>
    </ion-label>

    <ion-chip v-if="theClass.isInProgress()" slot="end">
      <ion-label>In Progress</ion-label>
    </ion-chip>

  </IonItem>
</template>

<script lang="ts">
import {StudentUniversityClass} from "@/model/StudentUniversityClass";
import {IonItem, IonLabel, modalController, IonChip} from '@ionic/vue'
import UpcomingClassModal from "@/components/UpcomingClassModal.vue";

export default {
  name: "UpcomingClassItem",
  props: {
    theClass: StudentUniversityClass
  },
  setup() {

    async function openUpcomingModal(aClass: StudentUniversityClass) {
      const modal = await modalController.create({
        component: UpcomingClassModal,
        componentProps: {
          theClass: aClass
        }
      })
      return modal.present();
    }

    return {openUpcomingModal}
  },
  components: {
    IonItem,
    IonLabel,
    IonChip
  }
}
</script>