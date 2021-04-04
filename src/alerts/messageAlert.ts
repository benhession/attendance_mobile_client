import {alertController} from "@ionic/vue";
import {Router} from "vue-router";
import {Store} from "vuex";
import {State} from "@/store";

export async function presentMessageAlert(store: Store<State>, router: Router, header: string, message: string) {
    const alert = await alertController.create({
        header: header,
        message: message,
        backdropDismiss: false,
        buttons: ['Dismiss']
    })
    return alert.present();
}