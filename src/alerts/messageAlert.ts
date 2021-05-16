import {alertController} from "@ionic/vue";

export async function presentMessageAlert(header: string, message: string) {
    const alert = await alertController.create({
        header: header,
        message: message,
        backdropDismiss: false,
        buttons: ['Dismiss']
    })
    return alert.present();
}