import {InjectionKey} from 'vue';
import {ActionTree, createStore, GetterTree, MutationTree, Store, useStore as baseUseStore} from 'vuex';
import authService, {KeyCloakTokens} from "@/services/authService";
import {UserDefaults} from "@/services/UserDefaults";
// import { Keychain } from "@ionic-native/keychain";

const userDefaults = UserDefaults.getInstance();

const enum USER_DEFAULTS {
    LOGGED_IN = 'LOGGED_IN'
}

export interface State {
    loggedIn: boolean;
    accessToken: string;
    refreshToken: string;
    accessTokenExpiry: Date | null;
    refreshTokenExpiry: Date | null;
}

export const key: InjectionKey<Store<State>> = Symbol();
const state: State = {
    loggedIn: false,
    accessToken: "",
    refreshToken: "",
    accessTokenExpiry: null,
    refreshTokenExpiry: null
}

// enum for auto-completion
export const enum MUTATIONS {
    SET_LOGGED_IN = 'SET_LOGGED_IN',
    SET_ACCESS_TOKEN = 'SET_ACCESS_TOKEN',
    SET_ACCESS_EXPIRY = 'SET_ACCESS_EXPIRY',
    SET_REFRESH_TOKEN = 'SET_REFRESH_TOKEN',
    SET_REFRESH_EXPIRY = 'SET_REFRESH_EXPIRY',
    CLEAR_TOKENS = 'CLEAR_TOKENS'
}

const mutations: MutationTree<State> = {
    [MUTATIONS.SET_LOGGED_IN](state, loggedIn: boolean) {
        state.loggedIn = loggedIn;
    },
    [MUTATIONS.SET_ACCESS_TOKEN](state, tokenString: string) {
        state.accessToken = tokenString;
    },
    [MUTATIONS.SET_REFRESH_TOKEN](state, tokenString: string) {
        state.refreshToken = tokenString;
    },
    [MUTATIONS.SET_REFRESH_EXPIRY](state, dateTime: Date) {
        state.refreshTokenExpiry = dateTime;
    },
    [MUTATIONS.SET_ACCESS_EXPIRY](state, dateTime: Date) {
        state.accessTokenExpiry = dateTime;
    },
    [MUTATIONS.CLEAR_TOKENS](state) {
        state.refreshToken = "";
        state.refreshTokenExpiry = null;
        state.accessToken = "";
        state.accessTokenExpiry = null;
    }
}

export const enum ACTIONS {
    LOG_IN = 'LOG_IN',
    FETCH_TOKENS_PWD_GRANT = 'FETCH_TOKENS_PWD_GRANT',
    LOG_OUT = 'LOG_OUT',
    // TODO: save refresh token to keychain
    SAVE_REFRESH_TO_KEYCHAIN = 'SAVE_REFRESH_TO_KEYCHAIN'
}

const actions: ActionTree<State, any> = {
    [ACTIONS.LOG_IN](state, [username, password]) {
        return new Promise((resolve, reject) => {
            state.dispatch(ACTIONS.FETCH_TOKENS_PWD_GRANT, [username, password])
                .then(() => {
                    userDefaults.set(USER_DEFAULTS.LOGGED_IN, 'true')
                        .then(() => {
                            state.commit(MUTATIONS.SET_LOGGED_IN, true);
                        }).catch(e => reject(e));
                    resolve();
                })
                .catch(error => {
                    reject(error)
                })
        });
    },

    [ACTIONS.LOG_OUT](state) {
        return new Promise((resolve, reject) => {

            userDefaults.set(USER_DEFAULTS.LOGGED_IN, 'false')
                .then(() => {
                    state.commit(MUTATIONS.SET_LOGGED_IN, false);
                    resolve();
                }).catch( e => reject(e));
        })
    },

    [ACTIONS.FETCH_TOKENS_PWD_GRANT](state, [username, password]) {
        return new Promise((resolve, reject) => {

            authService.fetchTokensPwdGrant(username, password).then(
                (response) => {

                    let data: KeyCloakTokens | null = null;

                    // console.log("Status code: " + response.status + ", Status text: " + response.statusText);

                    if (response.statusText === 'OK') {
                        data = response.data;

                        if (data !== null) {

                            const accessExpiry: Date = new Date();
                            accessExpiry.setSeconds(accessExpiry.getSeconds() + data.expires_in);

                            const refreshExpiry: Date = new Date();
                            refreshExpiry.setSeconds(refreshExpiry.getSeconds() + data.refresh_expires_in);

                            state.commit(MUTATIONS.SET_ACCESS_TOKEN, data.access_token);
                            state.commit(MUTATIONS.SET_ACCESS_EXPIRY, accessExpiry);
                            state.commit(MUTATIONS.SET_REFRESH_TOKEN, data.refresh_token);
                            state.commit(MUTATIONS.SET_REFRESH_EXPIRY, refreshExpiry);

                            resolve();

                        } else {
                            reject("unable to get tokens for user")
                        }
                    }
                }).catch(e => {reject(e)});
        });
    }
}

const getters: GetterTree<State, any> = {
    getLoggedIn(state): Promise<boolean> {

        return userDefaults.get(USER_DEFAULTS.LOGGED_IN).then(response => {
            state.loggedIn = response === 'true';
            return state.loggedIn
        }).catch(() => {
            return Promise.reject("Unable to get logged in status")
        })
    }
}


export const store = createStore<State>({state, getters, actions, mutations});

export function useStore() {
    return baseUseStore(key);
}


