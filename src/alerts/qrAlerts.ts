import {alertController, modalController} from "@ionic/vue";
import {Plugins} from "@capacitor/core";
import {StudentUniversityClass} from "@/model/StudentUniversityClass";
import UpcomingClassModal from "@/components/UpcomingClassModal.vue";

export async function presentOpenSettingsAlert() {
    const alert = await alertController.create({
        header: 'QR Scanner',
        message: 'The scanner needs permission to access the camera.',
        backdropDismiss: false,
        buttons: [
            {
                text: 'Dismiss'
            },
            {
                text: 'Open Settings',
                handler: () => {
                    const {BarcodeScanner} = Plugins;
                    BarcodeScanner.openAppSettings();
                }
            }
        ]
    })
    return alert.present();
}

export async function presentViewClassAlert(aClass: StudentUniversityClass, message: string) {
    const alert = await alertController.create({
        header: 'Info',
        message: message,
        backdropDismiss: false,
        buttons: [
            {
                text: 'Dismiss'
            },
            {
                text: 'View class',
                handler: async () => {
                    const modal = await modalController.create({
                        component: UpcomingClassModal,
                        componentProps: {
                            theClass: aClass
                        }
                    })
                    return modal.present();
                }
            }
        ]
    })
    return alert.present();
}