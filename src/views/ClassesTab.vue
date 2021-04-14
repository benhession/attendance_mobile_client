<template>
  <ion-page>
    <ion-header>

      <ion-toolbar>
        <ion-buttons slot="primary">
          <ion-button color="primary" @click="logoutAlert">Logout</ion-button>
        </ion-buttons>
        <ion-title>Your classes</ion-title>
      </ion-toolbar>

    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Your classes</ion-title>
        </ion-toolbar>
      </ion-header>


      <div v-if="segmentValue === 'upcoming'">
        <UpcomingClassCard v-for="theClass in upcomingClasses" :key="theClass.classId" :the-class="theClass"/>
      </div>
      <div v-else>
        <PreviousClassCard v-for="theClass in previousClasses" :key="theClass.classId" :the-class="theClass"/>
      </div>


    </ion-content>
    <ion-footer class="ion-no-border">
      <ion-toolbar>
        <IonSegment @ionChange="segmentChanged($event)" value="upcoming">
          <IonSegmentButton value="previous" class="segment-btn">
            <IonLabel>Previous</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="upcoming" class="segment-btn">
            <IonLabel>Upcoming</IonLabel>
          </IonSegmentButton>
        </IonSegment>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script lang="ts">
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonLabel,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar
} from '@ionic/vue';
import {ref, computed} from "vue"
import {useStore} from "@/store";
import {useRouter} from "vue-router";
import {presentLogoutAlert} from "@/alerts/logoutAlert";

import {StudentUniversityClass} from "@/model/StudentUniversityClass";
import moment from "moment";
import UpcomingClassCard from "@/components/UpcomingClassCard.vue";
import PreviousClassCard from "@/components/PreviousClassCard.vue";

export default {
  name: 'ClassesTab',
  components: {
    PreviousClassCard,
    UpcomingClassCard,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonButtons,
    IonButton,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonFooter
  },
  setup() {

    //Constants
    const store = useStore();
    const router = useRouter();


    //Reactive references
    const segmentValue = ref('upcoming');

    //Computed properties
    const classes = computed(() => {return store.state.studentClasses});

    const upcomingClasses = computed(() => {
      const currentClasses: StudentUniversityClass[] = classes.value;

      return currentClasses.filter((theClass) => theClass.datetime.add(theClass.duration) > moment())
          .sort((a, b) => a.datetime <= b.datetime ? -1 : 1);
    });
    const previousClasses = computed(() => {
      const currentClasses: StudentUniversityClass[] = classes.value;

      return currentClasses.filter(theClass => theClass.datetime.add(theClass.duration) < moment())
          .sort((a, b) => a.datetime >= b.datetime ? -1 : 1);
    });

    // functions
    const logoutAlert = () => presentLogoutAlert(store, router);

    function segmentChanged(ev: CustomEvent) {
      segmentValue.value = ev.detail.value;
    }

    return {logoutAlert, segmentChanged, upcomingClasses, previousClasses, segmentValue}
  }
}
</script>

<style scoped>
.segment-btn {
  font-size: 1em;
  padding: .2em 2em;
}

</style>