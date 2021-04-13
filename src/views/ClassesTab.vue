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
import {ref, onMounted} from "vue"
import {ACTIONS, useStore} from "@/store";
import {useRouter} from "vue-router";
import {presentLogoutAlert} from "@/alerts/logoutAlert";
import {presentMessageAlert} from "@/alerts/messageAlert";
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

    const store = useStore();
    const router = useRouter();
    const logoutAlert = () => presentLogoutAlert(store, router);
    let classes: StudentUniversityClass[] = new Array<StudentUniversityClass>();
    // reactive variables
    const upcomingClasses = ref<Array<StudentUniversityClass>>(new Array<StudentUniversityClass>());
    const previousClasses = ref<Array<StudentUniversityClass>>(new Array<StudentUniversityClass>());
    const segmentValue = ref('upcoming');

    //TODO: clear classes on logout
    onMounted(() => {
      // fetch student classes
      store.dispatch(ACTIONS.FETCH_STUDENT_CLASSES)
          .then(() => {

            classes = store.getters.getStudentClasses;

            // organise by date
            function getUpcomingClasses(classes: Array<StudentUniversityClass>): Array<StudentUniversityClass> {
              return classes.filter(theClass => theClass.datetime.add(theClass.duration) > moment())
                  .sort((a, b) => a.datetime <= b.datetime ? -1 : 1);
            }

            function getPreviousClasses(classes: Array<StudentUniversityClass>): Array<StudentUniversityClass> {
              return classes.filter(theClass => theClass.datetime.add(theClass.duration) < moment())
                  .sort((a, b) => a.datetime >= b.datetime ? -1 : 1);
            }

            upcomingClasses.value = getUpcomingClasses(classes);
            previousClasses.value = getPreviousClasses(classes);

          })
          .catch((e: Error) => {
            console.log(e);
            if (e.message === "refresh token is expired") {
              store.dispatch(ACTIONS.LOG_OUT).then(() => router.push({name: 'login'}))
            } else {
              presentMessageAlert(store, router, 'Error', e.message)
            }
          });
    });

    // show selected classes
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