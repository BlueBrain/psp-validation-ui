import Vue from 'vue';
import Vuex from 'vuex';
import tableEditingModule from '@/store/table-editing-module';
import generalParamsModule from '@/store/general-panel-module';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    title: '',
  },
  mutations: {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    changeTitle(state: any, newTitle: string) {
      state.title = newTitle;
    },
  },
  actions: {},
  modules: {
    tableEditingModule,
    generalParamsModule,
  },
});
