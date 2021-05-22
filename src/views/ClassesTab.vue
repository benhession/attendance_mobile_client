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

      <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Your classes</ion-title>
        </ion-toolbar>
      </ion-header>

      <div v-if="segmentValue === 'upcoming'" style="height: 100%">

        <div v-if="upcomingClasses === undefined || upcomingClasses.length === 0" class="ion-padding">
          <h4>There are no upcoming classes to display</h4>
        </div>

        <ion-list v-else>
          <upcoming-class-item v-for="theClass in upcomingClasses" :key="theClass.classId" :the-class="theClass"/>
        </ion-list>

      </div>

      <div v-else>

        <div v-if="previousClasses === undefined || previousClasses.length === 0" class="ion-padding">
          <div>
            <h4>There are no previous classes to display</h4>
          </div>
        </div>

        <ion-list v-else>
          <previous-class-item v-for="theClass in previousClasses" :key="theClass.classId" :the-class="theClass"/>
        </ion-list>
      </div>

    </ion-content>

    <ion-footer class="ion-no-border">

      <div class="ion-padding-horizontal">
        <IonSegment @ionChange="segmentChanged($event)" value="upcoming">
          <IonSegmentButton value="previous" class="segment-btn">
            <IonLabel>Previous</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="upcoming" class="segment-btn">
            <IonLabel>Upcoming</IonLabel>
          </IonSegmentButton>
        </IonSegment>
      </div>

      <div class="ion-padding" style="text-align: center">
        <p v-if="attendancePercentage >= 80">You have achieved {{ attendancePercentage }}% attendance. Well done!</p>
        <p v-else-if="attendancePercentage === 0">Your attendance percentage will be displayed here.</p>
        <p v-else style="color: red">You have achieved {{ attendancePercentage }}% attendance.
          Attendance below 80% can negatively affect your final grade.</p>
      </div>

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
  IonList,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar
} from '@ionic/vue';
import {computed, ref} from "vue"
import {ACTIONS, useStore} from "@/store";
import {useRouter} from "vue-router";
import {presentLogoutAlert} from "@/alerts/logoutAlert";

import {StudentUniversityClass} from "@/model/StudentUniversityClass";
import UpcomingClassItem from "@/components/UpcomingClassItem.vue";
import PreviousClassItem from "@/components/PreviousClassItem.vue";

export default {
  name: 'ClassesTab',
  components: {
    PreviousClassItem,
    UpcomingClassItem,
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
    IonFooter,
    IonList,
    IonRefresher,
    IonRefresherContent
  },
  setup() {

    //Constants
    const store = useStore();
    const router = useRouter();

    //Reactive references
    const segmentValue = ref('upcoming');

    //Computed properties
    const classes = computed(() => {
      return store.state.studentClasses
    });

    const upcomingClasses = computed(() => {
      const currentClasses: StudentUniversityClass[] = classes.value;

      return currentClasses.filter((theClass) => {
        return theClass.isUpcomingClass();
      }).sort((a, b) => a.datetime <= b.datetime ? -1 : 1);
    });

    const previousClasses = computed(() => {
      const currentClasses: StudentUniversityClass[] = classes.value;

      return currentClasses.filter(theClass => {
        return theClass.isPreviousClass();
      }).sort((a, b) => a.datetime >= b.datetime ? -1 : 1);
    });

    const attendancePercentage = computed(() => {
      let attendedClasses = 0;
      const numberOfClasses = previousClasses.value.length;

      if (numberOfClasses === 0) {
        return 0;
      }

      previousClasses.value.forEach((theClass) => {
        if (theClass.attended) {
          attendedClasses += 1;
        }
      });

      return Math.round((attendedClasses / numberOfClasses) * 100);

    });

    // functions
    const logoutAlert = () => presentLogoutAlert(store, router);

    function segmentChanged(ev: CustomEvent) {
      segmentValue.value = ev.detail.value;
    }

    function doRefresh(event: CustomEvent) {
      const target = event.target as HTMLIonRefresherElement;

      store.dispatch(ACTIONS.FETCH_STUDENT_CLASSES).then(() => {
        target.complete();
      })
          .catch(() => {
            target.complete();
          });
    }

    return {logoutAlert, segmentChanged, upcomingClasses, previousClasses, segmentValue, doRefresh, attendancePercentage}
  }
}
</script>

<style scoped>
.segment-btn {
  font-size: 1em;
  padding: .2em 2em;
}

/* required to make the camera preview visible */
@media (prefers-color-scheme: dark) {
  .ios ion-content {
    --ion-background-color: black;
  }
}
</style>
