import Vue from 'vue';
import Vuex from 'vuex';
import tableEditingModule from '@/store/table-editing-module';
import generalParamsModule from '@/store/general-panel-module';
import { StateInterface } from '@/interfaces/store';
import { setToken, hashString } from '@/helpers/backend-helper';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    title: '',
    packageVersion: process.env.VUE_APP_VERSION || '0',
    token: '',
    userId: '',
  } as StateInterface,
  mutations: {
    changeTitle(state: StateInterface, newTitle: string) {
      state.title = newTitle;
    },
    setToken(state: StateInterface, newToken: string) {
      state.token = newToken;
      setToken(newToken);
    },
    setUserId(state: StateInterface, newUserId: string) {
      state.userId = newUserId;
    },
  },
  actions: {
    async saveUserId({ commit }, userId) {
      const hashedUserId = await hashString(userId);
      commit('setUserId', hashedUserId);
    },
  },
  modules: {
    tableEditingModule,
    generalParamsModule,
  },
});
