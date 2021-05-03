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

export async function presentPermissionConfirmation(): Promise<boolean> {

    let confirmation = false;

    const alert = await alertController.create({
        header: 'QR Scanner',
        message: 'QR Scanner requires camera access',
        buttons: [
            {
                text: 'Deny',
                handler: () => {
                    confirmation = false;
                    alert.dismiss();
                    return false;
                }
            },
            {
                text: 'Allow',
                handler: () => {
                    confirmation = true;
                    alert.dismiss();
                    return false;
                }
            }
        ]
    })

    await alert.present();
    await alert.onDidDismiss();
    return confirmation;


}