import {alertController} from "@ionic/vue";
import {ACTIONS, State} from "@/store";
import {Router} from "vue-router";
import {Store} from "vuex";

export async function presentLogoutAlert(store: Store<State>, router: Router) {
    const alert = await alertController.create({
        header: 'Logout',
        message: 'Do you want to logout?',
        backdropDismiss: false,
        buttons: [
            {
                text: 'Dismiss'
            },
            {
                text: 'Logout',
                handler: () => {
                    store.dispatch(ACTIONS.LOG_OUT).then(() => {
                        router.push({name: 'login'});
                    }).catch(e => console.error(e));
                }
            }
        ]
    })
    return alert.present();
}

export async function presentLogoutAlertAndCallback(store: Store<State>, router: Router, onLogOut: () => void ) {
    const alert = await alertController.create({
        header: 'Logout',
        message: 'Do you want to logout?',
        backdropDismiss: false,
        buttons: [
            {
                text: 'Dismiss'
            },
            {
                text: 'Logout',
                handler: () => {
                    store.dispatch(ACTIONS.LOG_OUT).then(() => {
                        onLogOut();
                        router.push({name: 'login'});
                    }).catch(e => console.error(e));
                }
            }
        ]
    })
    return alert.present();
}

