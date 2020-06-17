import Vue from 'vue';
import Vuex from 'vuex';
import tableEditingModule from '@/store/table-editing-module';
import generalParamsModule from '@/store/general-panel-module';
import { StateInterface } from '@/interfaces/store';
import { setAxiosToken } from '@/helpers/unicore';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    title: '',
    packageVersion: process.env.PACKAGE_VERSION || '0',
    token: '',
  } as StateInterface,
  mutations: {
    changeTitle(state: StateInterface, newTitle: string) {
      state.title = newTitle;
    },
    setToken(state: StateInterface, newToken: string) {
      state.token = newToken;
      setAxiosToken(newToken);
    },
  },
  actions: {},
  modules: {
    tableEditingModule,
    generalParamsModule,
  },
});
