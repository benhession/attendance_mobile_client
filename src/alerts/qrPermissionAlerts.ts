import {alertController} from "@ionic/vue";
import { Plugins } from "@capacitor/core";

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
                    const { BarcodeScanner }  = Plugins;
                    BarcodeScanner.openAppSettings();
                }
            }
        ]
    })
    return alert.present();
}