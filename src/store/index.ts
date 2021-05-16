import {InjectionKey} from 'vue';
import {ActionContext, ActionTree, createStore, GetterTree, MutationTree, Store, useStore as baseUseStore} from 'vuex';
import authService, {KeyCloakTokens} from "@/services/authService";
import {USER_DEFAULTS, UserDefaults} from "@/store/UserDefaults";
import {Keychain} from "@ionic-native/keychain";
import {StudentUniversityClass, StudentUniversityClassInterface} from "@/model/StudentUniversityClass";
import universityClassService, {ATTEND_STATUS} from "@/services/universityClassService"

const userDefaults = UserDefaults.getInstance();

const enum KEYCHAIN {
    REFRESH_TOKEN = 'REFRESH_TOKEN',
    REFRESH_EXPIRY = 'REFRESH_EXPIRY'
}

export interface State {
    loggedIn: boolean;
    accessToken: string;
    accessTokenExpiry: Date | null;
    studentClasses: Array<StudentUniversityClass>;
}

export const key: InjectionKey<Store<State>> = Symbol();
const state: State = {
    loggedIn: false,
    accessToken: "",
    accessTokenExpiry: null,
    studentClasses: new Array<StudentUniversityClass>()
}

// enum for auto-completion
export const enum MUTATIONS {
    SET_LOGGED_IN = 'SET_LOGGED_IN',
    SET_ACCESS_TOKEN = 'SET_ACCESS_TOKEN',
    SET_ACCESS_EXPIRY = 'SET_ACCESS_EXPIRY',
    CLEAR_ACCESS_TOKEN = 'CLEAR_TOKENS',
    UPDATE_STUDENT_CLASSES = 'UPDATE_STUDENT_CLASSES',
    CLEAR_STUDENT_CLASSES = 'CLEAR_STUDENT_CLASSES'
}

const mutations: MutationTree<State> = {
    [MUTATIONS.SET_LOGGED_IN](state, loggedIn: boolean) {
        state.loggedIn = loggedIn;
    },

    [MUTATIONS.SET_ACCESS_TOKEN](state, tokenString: string) {
        state.accessToken = tokenString;
    },

    [MUTATIONS.SET_ACCESS_EXPIRY](state, dateTime: Date) {
        state.accessTokenExpiry = dateTime;
    },

    [MUTATIONS.CLEAR_ACCESS_TOKEN](state) {
        state.accessToken = "";
        state.accessTokenExpiry = null;
    },

    [MUTATIONS.UPDATE_STUDENT_CLASSES](state, classes: Array<StudentUniversityClass>) {
        state.studentClasses = classes;
    },
    [MUTATIONS.CLEAR_STUDENT_CLASSES](state) {
        state.studentClasses = []
    }

}

export const enum ACTIONS {
    LOG_IN = 'LOG_IN',
    FETCH_TOKENS_PWD_GRANT = 'FETCH_TOKENS_PWD_GRANT',
    LOG_OUT = 'LOG_OUT',
    FETCH_TOKENS_REFRESH_GRANT = 'FETCH_TOKENS_REFRESH_GRANT',
    FETCH_STUDENT_CLASSES = 'FETCH_STUDENT_CLASSES',
    UPDATE_ACCESS_TOKEN = 'UPDATE_ACCESS_TOKEN',
    ATTEND_CLASS = 'ATTEND_CLASS'
}

// actions helper function
function updateTokens(state: ActionContext<State, any>, data: KeyCloakTokens): Promise<void> {

    const accessExpiry: Date = new Date();
    accessExpiry.setSeconds(accessExpiry.getSeconds() + data.expires_in);

    const refreshExpiry: Date = new Date();
    refreshExpiry.setSeconds(refreshExpiry.getSeconds() + data.refresh_expires_in);

    state.commit(MUTATIONS.SET_ACCESS_TOKEN, data.access_token);
    state.commit(MUTATIONS.SET_ACCESS_EXPIRY, accessExpiry);

    Keychain.setJson(KEYCHAIN.REFRESH_TOKEN, data.refresh_token, false)
        .catch(e => new Error("Unable to set json in keychain: " + e));
    return Keychain.setJson(KEYCHAIN.REFRESH_EXPIRY, refreshExpiry.toISOString(), false);

}

const actions: ActionTree<State, any> = {
    [ACTIONS.LOG_IN](state, [username, password]): Promise<void> {
        return new Promise((resolve, reject) => {
            state.dispatch(ACTIONS.FETCH_TOKENS_PWD_GRANT, [username, password])
                .then(() => {
                    userDefaults.set(USER_DEFAULTS.LOGGED_IN, 'true')
                        .then(() => {
                            state.commit(MUTATIONS.SET_LOGGED_IN, true);
                            state.dispatch(ACTIONS.FETCH_STUDENT_CLASSES).then(() => resolve()).catch((e) => reject(e));
                        }).catch(e => reject(e));
                })
                .catch((e: Error) => reject(e))
        });
    },

    [ACTIONS.LOG_OUT](state): Promise<void> {
        return new Promise((resolve, reject) => {

            userDefaults.set(USER_DEFAULTS.LOGGED_IN, 'false')
                .then(() => {
                    state.commit(MUTATIONS.SET_LOGGED_IN, false);
                    state.commit(MUTATIONS.CLEAR_ACCESS_TOKEN);
                    state.commit(MUTATIONS.CLEAR_STUDENT_CLASSES);
                    Keychain.remove(KEYCHAIN.REFRESH_EXPIRY).then();
                    Keychain.remove(KEYCHAIN.REFRESH_TOKEN).then();
                    resolve();
                }).catch((e) => reject(new Error("Unable to set 'Logged In' user default' ".concat(e))));
        })
    },

    [ACTIONS.FETCH_TOKENS_PWD_GRANT](state, [username, password]): Promise<void> {
        return new Promise((resolve, reject) => {

            authService.fetchTokensPwdGrant(username, password).then(
                (response) => {

                    let data: KeyCloakTokens | null = null;

                    if (response.statusText === 'OK') {
                        data = response.data;

                        if (data !== null) {

                            updateTokens(state, data).then(() => resolve());

                        } else {
                            reject(new Error("unable to get tokens from password grant"))
                        }
                    }
                }).catch((e: Error)=> reject(e));
        });
    },

    [ACTIONS.FETCH_TOKENS_REFRESH_GRANT](state): Promise<void> {
        return new Promise((resolve, reject) => {
            Keychain.getJson(KEYCHAIN.REFRESH_TOKEN).then(value => {
                authService.fetchTokensRefreshTokenGrant(value).then(response => {
                    let data: KeyCloakTokens | null = null;

                    if (response.statusText === 'OK') {
                        data = response.data;

                        if (data !== null) {

                            updateTokens(state, data).then(() => resolve());

                        } else {
                            reject(new Error("unable to get tokens from refresh grant"))
                        }
                    }
                }).catch((e: Error) => reject(e));
            }).catch((e: Error) => reject(e));
        });
    },

    [ACTIONS.UPDATE_ACCESS_TOKEN](state): Promise<void> {
        return new Promise((resolve, reject) => {

            if (state.getters.getAccessTokenIsExpired) {

                // if the access token is expired check the refresh token
                const refreshIsExpiredPromise = state.getters.getRefreshIsExpired;
                refreshIsExpiredPromise.then((isExpired: boolean) => {
                    if (isExpired) {
                        // reject log out and push to log in screen should be implemented in the view controller
                        reject(new Error("refresh token is expired"))
                    } else {
                        // otherwise update the tokens
                        state.dispatch(ACTIONS.FETCH_TOKENS_REFRESH_GRANT)
                            .then(() => resolve())
                            .catch((e: Error) => reject(e));
                    }
                }).catch(() => reject(new Error("get refresh isExpired failed")));

            } else {
                // if the access token is not expired then resolve
                resolve();
            }
        })
    },

    [ACTIONS.FETCH_STUDENT_CLASSES](state): Promise<void> {
        return new Promise((resolve, reject) => {

            state.dispatch(ACTIONS.UPDATE_ACCESS_TOKEN).then(() => {

                const accessToken = state.getters.getAccessToken;

                universityClassService.fetchStudentClasses(accessToken).then(response => {
                    if (response.status === 200) {

                        const dataArray: Array<StudentUniversityClassInterface> = response.data;
                        const classObjectArray: Array<StudentUniversityClass> = new Array<StudentUniversityClass>();

                        dataArray.forEach(studentClass =>
                            classObjectArray.push(new StudentUniversityClass(studentClass)));

                        state.commit(MUTATIONS.UPDATE_STUDENT_CLASSES, classObjectArray);

                        resolve();
                    } else {
                        reject(new Error("Unable to get classes from the resource server"))
                    }
                }).catch((e: Error) => reject(e));
            }).catch((e: Error) => reject(e));
        });
    },

    [ACTIONS.ATTEND_CLASS](state, qrString): Promise<ATTEND_STATUS> {
        return new Promise<ATTEND_STATUS>(((resolve, reject) => {

            const accessToken = state.getters.getAccessToken;

            universityClassService.attendClass(accessToken, qrString).then(response => {
                if (response.status === 200) {

                    const wasNotYetAttended: boolean = response.data;

                    if (wasNotYetAttended) {
                        state.dispatch(ACTIONS.FETCH_STUDENT_CLASSES).then(() => {
                           resolve(ATTEND_STATUS.SUCCESS);
                        }).catch(error => reject('Success but unable to fetch classes: '.concat(error)));
                    } else {
                        resolve(ATTEND_STATUS.ALREADY_ATTENDED);
                    }
                }

                else if (response.status === 204) {
                    resolve(ATTEND_STATUS.NOT_VALID_CLASS);
                }

                else {
                    reject('Unexpected status code: '.concat(String(response.status)))
                }

            }).catch(error => {

                if (error.response.status === 412) {
                    resolve(ATTEND_STATUS.NOT_IN_PROGRESS);
                } else {
                    reject('Unable to update attendance: '.concat(error));
                }
            })

        }));
    }

}

const getters: GetterTree<State, any> = {
    getLoggedIn(state): Promise<boolean> {

        return userDefaults.get(USER_DEFAULTS.LOGGED_IN).then(response => {
            state.loggedIn = response === 'true';
            return state.loggedIn
        }).catch(() => {
            return Promise.reject(new Error("Unable to get logged in status"))
        })
    },
    getRefreshIsExpired(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {

            Keychain.getJson(KEYCHAIN.REFRESH_EXPIRY).then(value => {
                const expiryDate = new Date(value);
                if (new Date() > expiryDate) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            }).catch(e => reject(e));
        })
    },
    getAccessTokenIsExpired(): boolean {
        if (state.accessTokenExpiry !== null) {
            return new Date() > state.accessTokenExpiry;
        } else {
            return true;
        }
    },
    getAccessToken(): string {
        return state.accessToken;
    }

}

export const store = createStore<State>({state, getters, actions, mutations});

export function useStore() {
    return baseUseStore(key);
}


