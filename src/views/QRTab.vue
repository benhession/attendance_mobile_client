<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="primary">
          <ion-button color="primary" @click="logoutAlert">Logout</ion-button>
        </ion-buttons>
        <ion-title>Scan QR code</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :scroll-y="false" style="--ion-background-color: transparent">

      <div v-if="scanActive" class="scan-box-container">
        <ion-icon :icon="scan" class="scan-box"></ion-icon>
      </div>

      <div v-else-if="!permissionGranted" class="scan-box-container">
        <ion-button @click="presentOpenSettingsAlert()">Scan QR code</ion-button>
      </div>

    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonButton,
  IonButtons,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
  onIonViewDidEnter,
  onIonViewWillLeave
} from '@ionic/vue';
import {scan} from 'ionicons/icons';
import {ACTIONS, useStore} from "@/store";
import {useRouter} from "vue-router";
import {presentMessageAlert} from '@/alerts/messageAlert'
import {presentLogoutAlertAndCallback} from "@/alerts/logoutAlert";
import {presentOpenSettingsAlert, presentViewClassAlert} from "@/alerts/qrAlerts";
import {Plugins} from "@capacitor/core";
import {CheckPermissionResult, SupportedFormat} from "@capacitor-community/barcode-scanner";
import {computed, ref} from "vue";
import {ATTEND_STATUS} from "@/services/universityClassService";
import {StudentUniversityClass} from "@/model/StudentUniversityClass";

export default {
  name: 'QRTab',
  components: {IonHeader, IonToolbar, IonTitle, IonPage, IonButtons, IonButton, IonIcon},
  setup() {

    // constants
    const store = useStore();
    const router = useRouter();

    // reactive refs
    const scanActive = ref(false);
    const permissionGranted = ref(true);

    //Computed properties
    const nextClass = computed(() => {
      const currentClasses: StudentUniversityClass[] = store.state.studentClasses;

      const upcomingClasses = currentClasses.filter((theClass) => {
        return theClass.isUpcomingClass();
      }).sort((a, b) => a.datetime <= b.datetime ? 1 : -1);

      return upcomingClasses.pop()
    });

    // helper functions
    const messageAlert = (header: string, message: string) => presentMessageAlert(header, message);

    async function didUserGrantPermission(): Promise<boolean> {
      const {BarcodeScanner} = Plugins;

      // check if user has granted permission
      const status: CheckPermissionResult = await BarcodeScanner.checkPermission({force: false});

      if (status.granted) {
        // permission is granted
        return true;
      } else if (status.denied || status.restricted || status.unknown) {
        // permission isn't granted - show open settings button by setting reactive ref to false
        permissionGranted.value = false;
        return false;
      } else if (status.neverAsked) {
        // get permission from the system
        const statusRequest: CheckPermissionResult = await BarcodeScanner.checkPermission({force: true});
        // double bang as could return undefined
        const granted = !!statusRequest.granted;
        permissionGranted.value = granted;
        return granted;
      }
      return false;
    }

    // scan functions
    function stopScan() {
      const {BarcodeScanner} = Plugins;
      scanActive.value = false;

      BarcodeScanner.showBackground();
      BarcodeScanner.stopScan();
    }

    function startScan() {
      const {BarcodeScanner} = Plugins;

      // try update classes first
      store.dispatch(ACTIONS.FETCH_STUDENT_CLASSES).then(async () => {

        await BarcodeScanner.hideBackground();
        scanActive.value = true;
        const result = await BarcodeScanner.startScan({targetedFormats: [SupportedFormat.QR_CODE]});

        if (result.hasContent) {

          store.dispatch(ACTIONS.ATTEND_CLASS, result.content).then(status => {
            const theStatus: ATTEND_STATUS = status;

            switch (theStatus) {
              case ATTEND_STATUS.SUCCESS: {
                // the class was set to attended and all classes have been updated on the device
                messageAlert('Info', 'Successfully attended class.').then(() => router.push('ClassesTab'));
                break;
              }
              case ATTEND_STATUS.ALREADY_ATTENDED: {
                // the class was already marked as attended
                messageAlert('Info', 'You are already shown as having attended this class.')
                    .then(() => router.push('ClassesTab'));
                break;
              }
              case ATTEND_STATUS.NOT_IN_PROGRESS: {
                // the student is an attendee but the class is not currently in progress
                messageAlert('Info',
                    'Attendance is not currently been taken, please speak to your tutor at the end of class.')
                    .then(() => router.push('ClassesTab'));
                break;
              }
              case ATTEND_STATUS.NOT_VALID_CLASS: {
                // the QR string doesn't match any class which the student is an attendee of

                const theClass: StudentUniversityClass | undefined = nextClass.value;

                if (theClass != undefined) {
                  presentViewClassAlert(theClass,
                      'The code does not match an enrolled class. Would you like to view information about your next class?')
                      .then(() => router.push('ClassesTab'));
                } else {
                  messageAlert('Info', 'The code does not match an enrolled class. There are no upcoming classes.')
                      .then(() => router.push('ClassesTab'))
                }
                break;
              }
              default: {
                // theStatus is invalid
                messageAlert('Info', 'Status Invalid').then(() => router.push('ClassesTab'));
                break;
              }
            }

            stopScan();

          }).catch(e => {
            messageAlert('Network Error', e);
            stopScan();
          });

        } else {
          messageAlert('Error', "No content from resource server")
              .then(() => router.push('ClassesTab'));
        }
      }).catch((e: Error) => messageAlert('Error', e.message)
          .then(() => router.push('ClassesTab')));
    }

    // Ionic hooks
    onIonViewDidEnter(() => didUserGrantPermission()
        .then(bool => {
          if (bool) {
            startScan();
          }
        })
    );

    onIonViewWillLeave(() => stopScan());

    // UI functions
    const logoutAlert = () => presentLogoutAlertAndCallback(store, router, () => stopScan());

    return {logoutAlert, scanActive, permissionGranted, scan, presentOpenSettingsAlert};
  }
}
</script>

<style>
.scan-box {
  color: #EAFBF480;
  font-size: 45vh;
  margin: 0 auto;
}

.scan-box-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

