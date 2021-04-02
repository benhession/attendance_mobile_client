import { InjectionKey } from 'vue';
import {createStore, useStore as baseUseStore, Store, ActionTree, MutationTree, GetterTree} from 'vuex';

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
  [MUTATIONS.SET_REFRESH_EXPIRY](state, seconds: number) {
    state.refreshTokenExpiry = new Date(seconds * 1000);
  },
  [MUTATIONS.SET_ACCESS_EXPIRY](state, seconds: number) {
    state.accessTokenExpiry = new Date(seconds * 1000);
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
}
const actions: ActionTree<State, any> = {
  [ACTIONS.LOG_IN](store) {
    store.commit(MUTATIONS.SET_LOGGED_IN, true);
  }
}

const getters: GetterTree<State, any>  = {
  getLoggedIn(state): boolean  {
    return state.loggedIn;
  },
}

export const store = createStore<State>({ state, getters, actions, mutations });

export function useStore() {
  return baseUseStore(key);
}


