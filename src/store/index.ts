import Vue from 'vue';
import Vuex from 'vuex';
import tableEditingModule from '@/store/table-editing-module';
import generalParamsModule from '@/store/general-panel-module';
import { StateInterface } from '@/interfaces/store';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    title: '',
    packageVersion: process.env.PACKAGE_VERSION || '0',
  } as StateInterface,
  mutations: {
    changeTitle(state: StateInterface, newTitle: string) {
      state.title = newTitle;
    },
  },
  actions: {},
  modules: {
    tableEditingModule,
    generalParamsModule,
  },
});
